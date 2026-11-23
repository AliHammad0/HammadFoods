
import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaCheckCircle, FaClipboardList } from 'react-icons/fa'
import * as THREE from 'three'

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  'https://hammadfoods-backend.vercel.app/api/v1'
).replace(/\/+$/, '')

const ORDERS_KEY = 'hammad-foods-orders'
const OLD_ORDER_KEY = 'hammad-foods-last-order'
const OLD_TIMER_KEY = 'hammad-foods-preparation-expiry'
const PREPARATION_TIME = 30 * 60 * 1000

const getOrderId = (order) =>
  order?.orderNumber || order?._id || order?.id || null

const kitchenStages = [
  'Preparing fresh pizza dough',
  'Kneading the dough by hand',
  'Rolling the dough into shape',
  'Chopping fresh vegetables',
  'Spreading rich tomato sauce',
  'Adding cheese and fresh toppings',
  'Baking pizza in the wood-fired oven',
  'Taking out your freshly baked pizza'
]

const PizzaKitchen = () => {
  const mountRef = useRef(null)
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    let animationFrame
    let disposed = false

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#211713')
    scene.fog = new THREE.Fog('#211713', 12, 25)

    const camera = new THREE.PerspectiveCamera(
      38,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    )

    camera.position.set(0, 4.5, 10)
    camera.lookAt(0, 1.35, 0)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false
    })

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.3

    container.appendChild(renderer.domElement)

    const material = (color, roughness = 0.75, metalness = 0) =>
      new THREE.MeshStandardMaterial({
        color,
        roughness,
        metalness
      })

    const mats = {
      skin: material('#c58b68'),
      skinDark: material('#985f46'),
      white: material('#f2eee7'),
      black: material('#292522'),
      apron: material('#303b3a'),
      steel: material('#a5abad', 0.3, 0.8),
      wood: material('#86502e'),
      darkWood: material('#39241b'),
      lightWood: material('#b17b4d'),
      red: material('#c63824'),
      tomato: material('#e64b32'),
      yellow: material('#edb83d'),
      green: material('#44834b'),
      dough: material('#d5a36d'),
      doughLight: material('#e8bd83'),
      cheese: material('#f3ce70'),
      oven: material('#413b37'),
      wall: material('#554037'),
      dark: material('#17100d'),
      mushroom: material('#79533b'),
      basil: material('#347542')
    }

    const box = (parent, size, mat, position) => {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(...size),
        mat
      )
      mesh.position.set(...position)
      mesh.castShadow = true
      mesh.receiveShadow = true
      parent.add(mesh)
      return mesh
    }

    const sphere = (parent, radius, mat, position) => {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 24, 18),
        mat
      )
      mesh.position.set(...position)
      mesh.castShadow = true
      mesh.receiveShadow = true
      parent.add(mesh)
      return mesh
    }

    const cylinder = (
      parent,
      top,
      bottom,
      height,
      mat,
      position,
      segments = 24
    ) => {
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(top, bottom, height, segments),
        mat
      )
      mesh.position.set(...position)
      mesh.castShadow = true
      mesh.receiveShadow = true
      parent.add(mesh)
      return mesh
    }

    // LIGHTING

    scene.add(
      new THREE.HemisphereLight('#fff0dc', '#39302a', 2)
    )

    const mainLight = new THREE.DirectionalLight('#fff1db', 3.5)
    mainLight.position.set(-3, 8, 5)
    mainLight.castShadow = true
    mainLight.shadow.mapSize.set(2048, 2048)
    scene.add(mainLight)

    const ovenLight = new THREE.PointLight('#ff741e', 14, 8)
    ovenLight.position.set(3, 1.5, 0.5)
    scene.add(ovenLight)

    const fillLight = new THREE.PointLight('#ffffff', 4, 12)
    fillLight.position.set(-4, 4, -3)
    scene.add(fillLight)

    const warmLight = new THREE.PointLight('#ffb45c', 3, 10)
    warmLight.position.set(0, 5, 1)
    scene.add(warmLight)

    // FLOOR AND WALL

    box(scene, [18, 0.2, 15], mats.darkWood, [0, -0.15, 0])
    box(scene, [15, 7, 0.2], mats.wall, [0, 3.3, -3.8])

    for (let i = 0; i < 8; i++) {
      box(
        scene,
        [0.035, 6.5, 0.04],
        mats.darkWood,
        [-6.5 + i * 1.85, 3.3, -3.65]
      )
    }

    for (let i = 0; i < 5; i++) {
      box(
        scene,
        [14, 0.025, 0.04],
        mats.lightWood,
        [0, 0.8 + i * 1.25, -3.65]
      )
    }

    // WALL SHELVES

    box(scene, [5.5, 0.14, 0.65], mats.wood, [-4.2, 3.7, -3.35])
    box(scene, [5.5, 0.14, 0.65], mats.wood, [-4.2, 2.65, -3.35])
    box(scene, [3.5, 0.14, 0.65], mats.wood, [4.8, 3.5, -3.35])

    // Kitchen jars

    const jarColors = [
      mats.yellow,
      mats.red,
      mats.green,
      mats.doughLight,
      mats.mushroom
    ]

    for (let i = 0; i < 5; i++) {
      const x = -6.3 + i * 0.85

      cylinder(scene, 0.16, 0.17, 0.45, mats.steel, [x, 3.98, -3.25])
      cylinder(scene, 0.17, 0.17, 0.025, mats.dark, [x, 4.22, -3.25])
      sphere(scene, 0.1, jarColors[i], [x, 4.05, -3.25])
    }

    for (let i = 0; i < 4; i++) {
      cylinder(
        scene,
        0.13,
        0.13,
        0.36,
        i % 2 ? mats.green : mats.red,
        [-6.1 + i * 1.1, 2.95, -3.25]
      )
    }

    // Decorative kitchen lights

    for (const x of [-4.5, 0, 4.5]) {
      cylinder(scene, 0.025, 0.025, 0.6, mats.dark, [x, 5.8, -2.8])

      const lamp = new THREE.Mesh(
        new THREE.SphereGeometry(0.32, 24, 16),
        new THREE.MeshStandardMaterial({
          color: '#ffd59b',
          emissive: '#ff9b38',
          emissiveIntensity: 1.5
        })
      )

      lamp.position.set(x, 5.45, -2.8)
      scene.add(lamp)

      const light = new THREE.PointLight('#ffbd72', 2, 5)
      light.position.set(x, 5.1, -2.5)
      scene.add(light)
    }

    // WORKING TABLE

    box(scene, [6.5, 0.22, 2], mats.wood, [0, 1, 0.3])
    box(scene, [6.3, 0.85, 1.85], mats.darkWood, [0, 0.48, 0.3])
    box(scene, [6.4, 0.055, 0.04], mats.lightWood, [0, 0.82, 1.25])

    for (const x of [-2.8, 2.8]) {
      for (const z of [-0.3, 0.9]) {
        box(scene, [0.16, 1, 0.16], mats.darkWood, [x, 0.25, z])
      }
    }

    // CUTTING BOARD

    const board = box(
      scene,
      [1.35, 0.09, 0.85],
      mats.lightWood,
      [-1.8, 1.18, 0.55]
    )

    // PIZZA DOUGH

    const pizza = new THREE.Group()
    pizza.position.set(0.45, 1.2, 0.2)
    scene.add(pizza)

    const dough = new THREE.Mesh(
      new THREE.CylinderGeometry(0.78, 0.78, 0.12, 64),
      mats.dough
    )
    dough.scale.z = 0.78
    dough.castShadow = true
    pizza.add(dough)

    const crust = new THREE.Mesh(
      new THREE.TorusGeometry(0.72, 0.085, 16, 64),
      mats.doughLight
    )
    crust.rotation.x = Math.PI / 2
    crust.scale.y = 0.78
    crust.position.y = 0.07
    pizza.add(crust)

    const sauce = new THREE.Mesh(
      new THREE.CylinderGeometry(0.66, 0.66, 0.025, 64),
      mats.red
    )
    sauce.scale.z = 0.78
    sauce.position.y = 0.075
    pizza.add(sauce)

    const cheeseLayer = new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 0.6, 0.025, 64),
      mats.cheese
    )
    cheeseLayer.scale.z = 0.78
    cheeseLayer.position.y = 0.095
    pizza.add(cheeseLayer)

    // Pizza toppings

    const toppings = new THREE.Group()
    toppings.position.y = 0.115
    pizza.add(toppings)

    const toppingMaterials = [
      mats.tomato,
      mats.green,
      mats.mushroom,
      mats.cheese,
      mats.basil
    ]

    for (let i = 0; i < 22; i++) {
      const angle = (i / 22) * Math.PI * 2
      const radius = 0.22 + (i % 3) * 0.12

      const topping = new THREE.Mesh(
        new THREE.CylinderGeometry(0.065, 0.07, 0.035, 16),
        toppingMaterials[i % toppingMaterials.length]
      )

      topping.position.set(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius * 0.78
      )

      toppings.add(topping)
    }

    toppings.visible = false

    // SAUCE SPOON

    const spoon = new THREE.Group()
    spoon.position.set(0.1, 1.45, 0.65)
    scene.add(spoon)

    cylinder(spoon, 0.025, 0.025, 0.55, mats.steel, [0, 0, 0.2])
    sphere(spoon, 0.12, mats.red, [0, 0.28, 0.2])

    // ROLLING PIN

    const rollingPin = new THREE.Group()
    rollingPin.position.set(-1.9, 1.42, 0.6)
    scene.add(rollingPin)

    cylinder(
      rollingPin,
      0.09,
      0.09,
      0.8,
      mats.lightWood,
      [0, 0, 0],
      32
    )

    for (const x of [-0.48, 0.48]) {
      cylinder(rollingPin, 0.035, 0.035, 0.25, mats.darkWood, [x, 0, 0])
    }

    // KNIFE

    const knife = new THREE.Group()
    knife.position.set(-1.8, 1.45, 0.6)
    scene.add(knife)

    box(knife, [0.12, 0.045, 0.45], mats.steel, [0, 0, 0])
    box(knife, [0.11, 0.07, 0.22], mats.darkWood, [0, 0, -0.32])

    // INGREDIENT BOWLS

    const ingredientItems = [
      { x: -2.6, color: mats.tomato },
      { x: -1.65, color: mats.green },
      { x: -0.7, color: mats.cheese },
      { x: 0.2, color: mats.mushroom },
      { x: 1.1, color: mats.basil }
    ]

    ingredientItems.forEach((item) => {
      const bowl = new THREE.Group()
      bowl.position.set(item.x, 1.15, 0.8)
      scene.add(bowl)

      cylinder(bowl, 0.25, 0.17, 0.14, mats.steel, [0, 0, 0], 32)

      for (let i = 0; i < 5; i++) {
        sphere(
          bowl,
          0.075,
          item.color,
          [
            Math.sin(i * 1.6) * 0.14,
            0.11,
            Math.cos(i * 1.6) * 0.12
          ]
        )
      }
    })

    // CHEF BODY

    const chef = new THREE.Group()
    chef.position.set(-2.35, 0, 0.4)
    scene.add(chef)

    // Legs

    for (const x of [-0.19, 0.19]) {
      const leg = cylinder(
        chef,
        0.13,
        0.15,
        0.82,
        mats.black,
        [x, 0.48, 0]
      )

      leg.rotation.z = x * 0.12

      sphere(chef, 0.16, mats.black, [x, 0.08, 0.1])
    }

    // Body

    const torso = new THREE.Mesh(
      new THREE.CylinderGeometry(0.37, 0.43, 0.95, 32),
      mats.white
    )
    torso.position.y = 1.38
    torso.castShadow = true
    chef.add(torso)

    const apron = box(
      chef,
      [0.58, 0.7, 0.09],
      mats.apron,
      [0, 1.18, 0.38]
    )

    for (let i = 0; i < 3; i++) {
      sphere(chef, 0.025, mats.steel, [0.02, 1.65 - i * 0.19, 0.365])
    }

    // Neck

    cylinder(chef, 0.13, 0.14, 0.22, mats.skin, [0, 1.96, 0])

    // HEAD

    const head = new THREE.Group()
    head.position.set(0, 2.24, 0)
    chef.add(head)

    sphere(head, 0.32, mats.skin, [0, 0, 0])
    sphere(head, 0.075, mats.skin, [-0.31, 0, 0])
    sphere(head, 0.075, mats.skin, [0.31, 0, 0])

    const eyeMat = material('#30241e')

    sphere(head, 0.035, eyeMat, [-0.11, 0.06, 0.29])
    sphere(head, 0.035, eyeMat, [0.11, 0.06, 0.29])
    sphere(head, 0.055, mats.skin, [0, -0.035, 0.32])

    box(
      head,
      [0.1, 0.025, 0.025],
      material('#683e34'),
      [0, -0.15, 0.3]
    )

    sphere(head, 0.065, mats.black, [-0.065, -0.11, 0.31])
    sphere(head, 0.065, mats.black, [0.065, -0.11, 0.31])

    // Chef hat

    cylinder(chef, 0.31, 0.31, 0.1, mats.white, [0, 2.56, 0])
    sphere(chef, 0.27, mats.white, [0, 2.78, 0])
    sphere(chef, 0.21, mats.white, [0, 2.92, 0])
    sphere(chef, 0.18, mats.white, [-0.17, 2.78, 0])
    sphere(chef, 0.18, mats.white, [0.17, 2.78, 0])

    // ARMS WITH SHOULDER AND ELBOW JOINTS

    const arms = []

    for (const side of [-1, 1]) {
      const shoulder = new THREE.Group()
      shoulder.position.set(side * 0.37, 1.76, 0)
      chef.add(shoulder)

      cylinder(
        shoulder,
        0.13,
        0.15,
        0.47,
        mats.white,
        [0, -0.23, 0]
      )

      const elbow = new THREE.Group()
      elbow.position.set(0, -0.45, 0)
      shoulder.add(elbow)

      cylinder(
        elbow,
        0.095,
        0.12,
        0.4,
        mats.white,
        [0, -0.2, 0]
      )

      const hand = sphere(
        elbow,
        0.11,
        mats.skin,
        [0, -0.42, 0.02]
      )

      sphere(elbow, 0.055, mats.skin, [0.06, -0.45, 0.08])

      arms.push({ shoulder, elbow, hand, side })
    }

    // OVEN

    const oven = new THREE.Group()
    oven.position.set(2.7, 0, -0.2)
    scene.add(oven)

    box(oven, [1.7, 1.8, 1.5], mats.oven, [0, 0.95, 0])

    // Oven arch

    const arch = new THREE.Mesh(
      new THREE.TorusGeometry(0.55, 0.13, 20, 48, Math.PI),
      material('#9b8170')
    )
    arch.position.set(0, 1.15, 0.77)
    oven.add(arch)

    box(
      oven,
      [1.05, 0.9, 0.06],
      mats.dark,
      [0, 1.05, 0.77]
    )

    const fireGroup = new THREE.Group()
    fireGroup.position.set(0, 0.9, 0.84)
    oven.add(fireGroup)

    for (let i = 0; i < 9; i++) {
      const flame = new THREE.Mesh(
        new THREE.ConeGeometry(
          0.12,
          0.5 + Math.random() * 0.3,
          12
        ),
        new THREE.MeshBasicMaterial({
          color: i % 2 ? '#ff9a28' : '#ff4515',
          transparent: true,
          opacity: 0.9
        })
      )

      flame.position.set(
        (Math.random() - 0.5) * 0.8,
        Math.random() * 0.1,
        0
      )

      fireGroup.add(flame)
    }

    box(
      oven,
      [1.4, 0.12, 1.2],
      material('#b9a18b'),
      [0, 0.18, 0.05]
    )

    // PIZZA PEEL

    const peel = new THREE.Group()
    peel.position.set(1.5, 1.13, 0.3)
    scene.add(peel)

    box(peel, [0.65, 0.035, 0.7], mats.wood, [0, 0, 0])
    cylinder(peel, 0.045, 0.045, 1.05, mats.wood, [0, 0, 0.75])

    // Finished pizza inside oven

    const ovenPizza = new THREE.Group()
    ovenPizza.position.set(2.7, 0.65, 0.8)
    scene.add(ovenPizza)

    const bakedBase = cylinder(
      ovenPizza,
      0.36,
      0.36,
      0.07,
      mats.doughLight,
      [0, 0, 0]
    )

    bakedBase.scale.z = 0.78

    const bakedTop = cylinder(
      ovenPizza,
      0.3,
      0.3,
      0.025,
      mats.cheese,
      [0, 0.05, 0]
    )

    bakedTop.scale.z = 0.78
    ovenPizza.visible = false

    // Floating flour particles

    const flourCount = 100
    const flourGeometry = new THREE.BufferGeometry()
    const flourPositions = new Float32Array(flourCount * 3)
    const flourSpeeds = []

    for (let i = 0; i < flourCount; i++) {
      flourPositions[i * 3] = (Math.random() - 0.5) * 5
      flourPositions[i * 3 + 1] = Math.random() * 3
      flourPositions[i * 3 + 2] = Math.random() * 2

      flourSpeeds.push(0.2 + Math.random() * 0.4)
    }

    flourGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(flourPositions, 3)
    )

    const flour = new THREE.Points(
      flourGeometry,
      new THREE.PointsMaterial({
        color: '#f5e8cf',
        size: 0.035,
        transparent: true,
        opacity: 0.6
      })
    )

    scene.add(flour)

    // STEAM PARTICLES

    const steamParticles = []

    for (let i = 0; i < 12; i++) {
      const particle = sphere(
        scene,
        0.06 + Math.random() * 0.04,
        new THREE.MeshBasicMaterial({
          color: '#fff0dd',
          transparent: true,
          opacity: 0.22
        }),
        [2.7 + (Math.random() - 0.5) * 0.6, 1.6, 0.8]
      )

      steamParticles.push(particle)
    }

    // Animation helpers

    const smooth = (current, target, speed) =>
      THREE.MathUtils.lerp(current, target, speed)

    const clock = new THREE.Clock()
    let elapsedTotal = 0
    let lastStage = -1

    const animate = () => {
      if (disposed) return

      animationFrame = requestAnimationFrame(animate)

      const delta = Math.min(clock.getDelta(), 0.04)
      elapsedTotal += delta

      const elapsed = elapsedTotal
      const cycleDuration = 48
      const cycleTime = elapsed % cycleDuration
      const currentStage = Math.floor(cycleTime / 6)
      const stageTime = cycleTime % 6

      if (currentStage !== lastStage) {
        lastStage = currentStage
        setStage(currentStage)
      }

      // Natural chef body movement

      chef.position.y = Math.sin(elapsed * 2.1) * 0.012
      chef.rotation.z = Math.sin(elapsed * 0.8) * 0.025

      head.rotation.x = smooth(
        head.rotation.x,
        currentStage === 6 ? -0.15 : 0.05,
        0.04
      )

      head.rotation.y = Math.sin(elapsed * 0.65) * 0.08

      // Default arm positions

      let leftShoulder = -0.35
      let rightShoulder = 0.35
      let leftElbow = -0.3
      let rightElbow = 0.3
      let bodyLean = 0

      // STAGE 1: Preparing dough

      if (currentStage === 0) {
        leftShoulder = -0.6 + Math.sin(elapsed * 2) * 0.12
        rightShoulder = 0.6 + Math.sin(elapsed * 2 + 1) * 0.12

        leftElbow = -0.5
        rightElbow = 0.5
        bodyLean = -0.05
      }

      // STAGE 2: Kneading dough

      if (currentStage === 1) {
        const knead = Math.sin(stageTime * 3.5)

        leftShoulder = -0.85 + knead * 0.15
        rightShoulder = 0.85 - knead * 0.15

        leftElbow = -0.65 + knead * 0.12
        rightElbow = 0.65 - knead * 0.12

        bodyLean = -0.12
        dough.scale.set(
          1 + Math.sin(stageTime * 3) * 0.025,
          1,
          0.78
        )
      }

      // STAGE 3: Rolling pizza dough

      if (currentStage === 2) {
        const roll = Math.sin(stageTime * 3)

        leftShoulder = -0.9 + roll * 0.12
        rightShoulder = 0.9 - roll * 0.12

        leftElbow = -0.7
        rightElbow = 0.7

        rollingPin.rotation.z = roll * 0.18
        rollingPin.position.x = -1.9 + roll * 0.18
        bodyLean = -0.1
      }

      // STAGE 4: Chopping vegetables

      if (currentStage === 3) {
        const chop = Math.abs(Math.sin(stageTime * 5))

        leftShoulder = -0.35
        rightShoulder = 0.95 - chop * 0.3

        leftElbow = -0.35
        rightElbow = 0.3 + chop * 0.5

        knife.rotation.z = chop * 0.35
        knife.position.y = 1.45 - chop * 0.12

        head.rotation.x = 0.22
        bodyLean = -0.14
      }

      // STAGE 5: Spreading sauce

      if (currentStage === 4) {
        const spread = Math.sin(stageTime * 2.8)

        leftShoulder = -0.4
        rightShoulder = 0.75 + spread * 0.15

        leftElbow = -0.3
        rightElbow = 0.5 + spread * 0.25

        spoon.rotation.z = spread * 0.4
        pizza.rotation.y = spread * 0.08

        bodyLean = -0.1
      }

      // STAGE 6: Adding cheese and toppings

      if (currentStage === 5) {
        const add = Math.sin(stageTime * 3.5)

        leftShoulder = -0.7 + add * 0.15
        rightShoulder = 0.75 - add * 0.2

        leftElbow = -0.45
        rightElbow = 0.5 + add * 0.2

        toppings.visible = stageTime > 0.5
        toppings.rotation.y = Math.sin(stageTime * 1.5) * 0.12

        bodyLean = -0.08
      }

      // STAGE 7: Putting pizza in oven

      if (currentStage === 6) {
        leftShoulder = -1.1
        rightShoulder = 1.1

        leftElbow = -0.7
        rightElbow = 0.7

        peel.position.x = smooth(
          peel.position.x,
          stageTime < 3 ? 2.1 : 1.5,
          0.025
        )

        ovenPizza.visible = stageTime > 2.5
        bodyLean = -0.08
      }

      // STAGE 8: Taking baked pizza out

      if (currentStage === 7) {
        leftShoulder = -0.65
        rightShoulder = 0.95

        leftElbow = -0.4
        rightElbow = 0.65

        peel.position.x = smooth(
          peel.position.x,
          stageTime < 3 ? 1.5 : 1.9,
          0.025
        )

        ovenPizza.visible = true
        ovenPizza.position.x = smooth(
          ovenPizza.position.x,
          stageTime < 3 ? 2.7 : 3.3,
          0.02
        )

        bodyLean = -0.05
      }

      // Smooth arm movement

      arms[0].shoulder.rotation.z = smooth(
        arms[0].shoulder.rotation.z,
        leftShoulder,
        0.09
      )

      arms[1].shoulder.rotation.z = smooth(
        arms[1].shoulder.rotation.z,
        rightShoulder,
        0.09
      )

      arms[0].elbow.rotation.z = smooth(
        arms[0].elbow.rotation.z,
        leftElbow,
        0.1
      )

      arms[1].elbow.rotation.z = smooth(
        arms[1].elbow.rotation.z,
        rightElbow,
        0.1
      )

      chef.rotation.x = smooth(
        chef.rotation.x,
        bodyLean,
        0.04
      )

      // Eye/head movement

      head.rotation.y += Math.sin(elapsed * 1.2) * 0.0008

      // Oven fire animation

      fireGroup.children.forEach((flame, i) => {
        flame.scale.y = 0.8 + Math.sin(elapsed * 8 + i) * 0.3
        flame.rotation.z = Math.sin(elapsed * 4 + i) * 0.12
      })

      ovenLight.intensity = 12 + Math.sin(elapsed * 5) * 3

      // Floating flour

      const positions = flour.geometry.attributes.position.array

      for (let i = 0; i < flourCount; i++) {
        positions[i * 3 + 1] += delta * flourSpeeds[i]

        positions[i * 3] += Math.sin(elapsed + i) * delta * 0.08

        if (positions[i * 3 + 1] > 3.5) {
          positions[i * 3 + 1] = 0.8
        }
      }

      flour.geometry.attributes.position.needsUpdate = true

      // Oven steam

      steamParticles.forEach((particle, i) => {
        particle.position.y += delta * (0.25 + i * 0.01)
        particle.position.x += Math.sin(elapsed + i) * delta * 0.12

        if (particle.position.y > 3) {
          particle.position.y = 1.5
          particle.position.x = 2.7 + (Math.random() - 0.5) * 0.6
        }

        particle.material.opacity =
          0.12 + Math.sin(elapsed * 2 + i) * 0.08
      })

      // Gentle camera movement

      camera.position.x = Math.sin(elapsed * 0.18) * 0.12
      camera.lookAt(0, 1.4, 0)

      renderer.render(scene, camera)
    }

    animate()

    const resizeObserver = new ResizeObserver(() => {
      if (disposed) return

      const width = container.clientWidth
      const height = container.clientHeight

      if (!width || !height) return

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    resizeObserver.observe(container)

    return () => {
      disposed = true
      cancelAnimationFrame(animationFrame)
      resizeObserver.disconnect()

      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose()

        if (object.material) {
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material]

          materials.forEach((mat) => mat.dispose())
        }
      })

      renderer.dispose()

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-[#49372c] bg-[#211713] shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/10 bg-[#30221b] px-4 py-4">
        <div>
          <p className="text-sm font-bold tracking-[2px] text-white">
            THE PIZZA KITCHEN
          </p>

          <p className="mt-1 text-xs text-orange-200/70">
            Fresh ingredients. Freshly prepared.
          </p>
        </div>

        <span className="flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-2 text-xs font-bold text-green-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
          LIVE
        </span>
      </div>

      <div
        ref={mountRef}
        className="h-[340px] w-full sm:h-[460px]"
      />

      <div className="border-t border-white/10 bg-[#30221b] px-4 py-4">
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <span className="text-xs font-bold uppercase tracking-[2px] text-orange-300">
            Current Kitchen Activity
          </span>

          <p className="text-sm font-semibold text-white sm:text-base">
            {kitchenStages[stage]}
          </p>

          <div className="mt-2 flex items-center gap-1.5">
            {kitchenStages.map((_, index) => (
              <span
                key={index}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  index === stage
                    ? 'w-8 bg-orange-400'
                    : index < stage
                      ? 'w-3 bg-green-500'
                      : 'w-3 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const readSavedOrders = () => {
  try {
    const saved = localStorage.getItem(ORDERS_KEY)

    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) return parsed
    }

    const oldOrderData = localStorage.getItem(OLD_ORDER_KEY)

    if (oldOrderData) {
      const oldOrder = JSON.parse(oldOrderData)

      if (oldOrder) {
        let expiresAt = Date.now() + PREPARATION_TIME

        const oldTimerData = localStorage.getItem(OLD_TIMER_KEY)

        if (oldTimerData) {
          const oldTimer = JSON.parse(oldTimerData)

          if (
            oldTimer.orderId === getOrderId(oldOrder) &&
            Number.isFinite(oldTimer.expiresAt)
          ) {
            expiresAt = oldTimer.expiresAt
          }
        }

        return [{
          id: getOrderId(oldOrder),
          order: oldOrder,
          expiresAt
        }]
      }
    }

    return []
  } catch (error) {
    console.error('Unable to read saved orders:', error)
    return []
  }
}

const clearSavedOrders = () => {
  localStorage.removeItem(ORDERS_KEY)
  localStorage.removeItem(OLD_ORDER_KEY)
  localStorage.removeItem(OLD_TIMER_KEY)
}

const OrderSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [databaseOrderCount, setDatabaseOrderCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentTime, setCurrentTime] = useState(Date.now())

  // Fetch database order count and verify saved orders
  useEffect(() => {
    let cancelled = false

    const fetchDatabaseOrders = async () => {
      setLoading(true)
      setError('')

      try {
        const countResponse = await fetch(`${API_BASE_URL}/orders/count`)
        const countData = await countResponse.json()

        if (!countResponse.ok || countData.ok !== true) {
          throw new Error(countData.message || 'Unable to fetch order count')
        }

        const total = Number(countData.total) || 0

        if (cancelled) return

        setDatabaseOrderCount(total)

        if (total === 0) {
          setOrders([])
          clearSavedOrders()
          return
        }

        const savedOrders = readSavedOrders()
        const currentOrder = location.state?.order

        let candidateOrders = [...savedOrders]

        if (currentOrder) {
          const currentId = getOrderId(currentOrder)

          const alreadyExists = candidateOrders.some(
            (item) =>
              item.id === currentId ||
              getOrderId(item.order) === currentId
          )

          if (!alreadyExists) {
            candidateOrders.unshift({
              id: currentId || `order-${Date.now()}`,
              order: currentOrder,
              expiresAt: Date.now() + PREPARATION_TIME
            })
          }
        }

        const verifiedOrders = await Promise.all(
          candidateOrders.map(async (item) => {
            const orderNumber = item.order?.orderNumber

            if (!orderNumber) return null

            try {
              const response = await fetch(
                `${API_BASE_URL}/orders/${encodeURIComponent(orderNumber)}`
              )

              if (!response.ok) return null

              const data = await response.json()

              if (!data.ok || !data.order) return null

              return {
                ...item,
                id: getOrderId(data.order),
                order: data.order,
                expiresAt: Number(item.expiresAt) ||
                  Date.now() + PREPARATION_TIME
              }
            } catch (verificationError) {
              console.error(
                'Order verification failed:',
                verificationError.message
              )
              return null
            }
          })
        )

        if (cancelled) return

        const validOrders = verifiedOrders.filter(Boolean)

        setOrders(validOrders)

        localStorage.setItem(
          ORDERS_KEY,
          JSON.stringify(validOrders)
        )

        localStorage.removeItem(OLD_ORDER_KEY)
        localStorage.removeItem(OLD_TIMER_KEY)

      } catch (fetchError) {
        console.error('Order fetch error:', fetchError.message)

        if (!cancelled) {
          setError(
            'Unable to connect to the orders database. Please refresh the page.'
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchDatabaseOrders()

    return () => {
      cancelled = true
    }
  }, [location.state])

  // Save verified orders
  useEffect(() => {
    if (loading || error) return

    try {
      localStorage.setItem(
        ORDERS_KEY,
        JSON.stringify(orders)
      )
    } catch (saveError) {
      console.error('Unable to save orders:', saveError)
    }
  }, [orders, loading, error])

  // Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const getRemainingTime = (expiresAt) =>
    Math.max(
      0,
      Math.floor((expiresAt - currentTime) / 1000)
    )

  const formatTime = (expiresAt) => {
    const timeLeft = getRemainingTime(expiresAt)

    const minutes = String(
      Math.floor(timeLeft / 60)
    ).padStart(2, '0')

    const seconds = String(
      timeLeft % 60
    ).padStart(2, '0')

    return { minutes, seconds, timeLeft }
  }

  if (loading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center px-4 font-[Arial]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-red-100 border-t-red-600" />

          <p className="mt-4 font-semibold text-gray-600">
            Checking your orders...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center px-4 text-center font-[Arial]">
        <h2 className="text-2xl font-bold text-gray-900">
          Orders Could Not Be Loaded
        </h2>

        <p className="mt-2 max-w-md text-gray-500">
          {error}
        </p>

        <button
          onClick={() => window.location.reload()}
          className="mt-6 rounded-lg bg-red-600 px-7 py-3 font-semibold text-white hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (databaseOrderCount === 0 || orders.length === 0) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center px-4 text-center font-[Arial]">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
          <FaClipboardList className="text-4xl text-gray-400" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900">
          No Orders Found
        </h2>

        <p className="mt-2 text-gray-500">
          {databaseOrderCount === 0
            ? 'There are currently 0 orders in the database.'
            : 'No saved orders were found on this device.'}
        </p>

        <p className="mt-3 rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-600">
          {databaseOrderCount} {databaseOrderCount === 1 ? 'Order' : 'Orders'}
        </p>

        <Link
          to="/"
          className="mt-6 rounded-lg bg-red-600 px-7 py-3 font-semibold text-white hover:bg-red-700"
        >
          Back to Menu
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-[75vh] bg-gray-50 px-4 py-12 font-[Arial]">
      <div className="mx-auto w-full max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-10">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
          <FaCheckCircle className="text-5xl text-green-600" />
        </div>

        <p className="mt-7 text-sm font-bold uppercase tracking-[3px] text-green-600">
          Order Confirmed
        </p>

        <h1 className="mt-3 text-3xl font-bold text-gray-900">
          Thank You!
        </h1>

        <p className="mt-3 leading-7 text-gray-500">
          Your order has been placed successfully. We will contact you soon.
        </p>

        <div className="mt-8 text-left">
          <PizzaKitchen />
        </div>

        <div className="mt-8 text-left">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-gray-900">
              Your Orders
            </h2>

            <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-bold text-red-600">
              {databaseOrderCount} {databaseOrderCount === 1 ? 'Order' : 'Orders'}
            </span>
          </div>

          <div className="space-y-6">
            {orders.map((item, index) => {
              const order = item.order
              const timer = formatTime(item.expiresAt)

              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-gray-200 bg-white p-5"
                >
                  <div className="flex items-center justify-between gap-3 border-b border-gray-200 pb-4">
                    <div className="flex items-center gap-2 text-gray-900">
                      <FaClipboardList className="text-red-600" />

                      <span className="font-bold">
                        Order #{index + 1}
                      </span>
                    </div>

                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                      {order.orderStatus || 'Pending'}
                    </span>
                  </div>

                  <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-5 text-center">
                    <p className="text-sm font-bold uppercase tracking-wider text-gray-700">
                      Estimated Preparation Time
                    </p>

                    <div className="mt-3 flex items-center justify-center gap-2">
                      <div className="min-w-20 rounded-xl bg-white px-4 py-3 shadow-sm">
                        <p className="text-4xl font-extrabold tabular-nums text-red-600">
                          {timer.minutes}
                        </p>

                        <p className="mt-1 text-xs font-semibold text-gray-500">
                          MINUTES
                        </p>
                      </div>

                      <span className="text-3xl font-bold text-red-600">
                        :
                      </span>

                      <div className="min-w-20 rounded-xl bg-white px-4 py-3 shadow-sm">
                        <p className="text-4xl font-extrabold tabular-nums text-red-600">
                          {timer.seconds}
                        </p>

                        <p className="mt-1 text-xs font-semibold text-gray-500">
                          SECONDS
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm font-medium text-gray-600">
                      {timer.timeLeft > 0
                        ? 'Your delicious pizza is getting ready!'
                        : 'Your estimated preparation time is over!'}
                    </p>
                  </div>

                  <div className="mt-5 rounded-xl bg-gray-50 p-5">
                    <div className="flex items-center gap-2 text-gray-900">
                      <FaClipboardList className="text-red-600" />

                      <span className="font-bold">
                        Order Details
                      </span>
                    </div>

                    <div className="mt-5 space-y-4 text-sm">
                      <div className="flex justify-between gap-3">
                        <span className="text-gray-500">
                          Order Number
                        </span>

                        <span className="break-all text-right font-bold text-gray-900">
                          {order.orderNumber || getOrderId(order) || 'N/A'}
                        </span>
                      </div>

                      <div className="flex justify-between gap-3">
                        <span className="text-gray-500">
                          Customer
                        </span>

                        <span className="text-right font-semibold text-gray-900">
                          {order.customer?.name || 'N/A'}
                        </span>
                      </div>

                      <div className="flex justify-between gap-3">
                        <span className="text-gray-500">
                          Payment Method
                        </span>

                        <span className="font-semibold text-gray-900">
                          Cash on Delivery
                        </span>
                      </div>

                      <div className="flex justify-between gap-3">
                        <span className="text-gray-500">
                          Order Status
                        </span>

                        <span className="font-semibold text-orange-600">
                          {order.orderStatus || 'Pending'}
                        </span>
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between gap-3">
                          <span className="font-bold text-gray-900">
                            Total Amount
                          </span>

                          <span className="text-lg font-bold text-red-600">
                            Rs. {Number(order.totalAmount || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="mt-8 w-full rounded-xl bg-red-600 px-6 py-4 font-bold text-white transition duration-300 hover:bg-red-700"
        >
          Continue Shopping
        </button>

      </div>
    </div>
  )
}

export default OrderSuccess
