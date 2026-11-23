
import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaCheckCircle, FaClipboardList } from 'react-icons/fa'
import * as THREE from 'three'

const PizzaKitchen = () => {
  const mountRef = useRef(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    let animationFrame
    let disposed = false

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#211b18')
    scene.fog = new THREE.Fog('#211b18', 10, 23)

    const camera = new THREE.PerspectiveCamera(
      38,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    )

    camera.position.set(0, 4.5, 9.5)
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
    renderer.toneMappingExposure = 1.25

    container.appendChild(renderer.domElement)

    // Materials
    const material = (color, roughness = 0.75, metalness = 0) =>
      new THREE.MeshStandardMaterial({
        color,
        roughness,
        metalness
      })

    const skin = material('#c58b68')
    const white = material('#f0eee8')
    const black = material('#292522')
    const apronMat = material('#292e30')
    const steel = material('#777e80', 0.35, 0.75)
    const wood = material('#75432b')
    const darkWood = material('#39251d')
    const red = material('#c63824')
    const yellow = material('#edb83d')
    const green = material('#44834b')
    const doughMat = material('#d5a36d')
    const cheese = material('#f3ce70')
    const ovenMat = material('#413b37')

    // Helpers
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

    const sphere = (parent, size, mat, position) => {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(size, 24, 20),
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
      radiusTop,
      radiusBottom,
      height,
      mat,
      position
    ) => {
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(
          radiusTop,
          radiusBottom,
          height,
          24
        ),
        mat
      )
      mesh.position.set(...position)
      mesh.castShadow = true
      mesh.receiveShadow = true
      parent.add(mesh)
      return mesh
    }

    // Lighting
    scene.add(new THREE.HemisphereLight('#fff0dc', '#39302a', 2))

    const mainLight = new THREE.DirectionalLight('#fff1db', 3)
    mainLight.position.set(-3, 8, 5)
    mainLight.castShadow = true
    mainLight.shadow.mapSize.set(1024, 1024)
    scene.add(mainLight)

    const ovenLight = new THREE.PointLight('#ff741e', 12, 7)
    ovenLight.position.set(3, 1.5, 0)
    scene.add(ovenLight)

    const fillLight = new THREE.PointLight('#ffffff', 4, 12)
    fillLight.position.set(-4, 4, -3)
    scene.add(fillLight)

    // Kitchen floor
    box(scene, [18, 0.2, 15], darkWood, [0, -0.15, 0])

    // Back wall
    box(scene, [15, 7, 0.2], material('#51433a'), [0, 3.3, -3.8])

    // Wall shelves
    box(scene, [5, 0.12, 0.55], wood, [-1.7, 3.6, -3.35])
    box(scene, [5, 0.12, 0.55], wood, [-1.7, 2.7, -3.35])

    // Shelves bottles
    for (let i = 0; i < 5; i++) {
      cylinder(
        scene,
        0.09,
        0.09,
        0.45,
        i % 2 ? green : red,
        [-3.5 + i * 0.8, 3.9, -3.2]
      )
    }

    // Kitchen counter
    box(scene, [6, 0.22, 1.6], wood, [0, 1, 0.2])
    box(scene, [6, 0.9, 1.5], darkWood, [0, 0.43, 0.2])

    // Counter front detail
    box(scene, [5.9, 0.06, 0.04], material('#a47750'), [0, 0.75, 0.97])

    // Pizza preparation area
    const pizza = new THREE.Group()
    pizza.position.set(0.1, 1.13, 0.1)
    scene.add(pizza)

    const dough = new THREE.Mesh(
      new THREE.CylinderGeometry(0.78, 0.78, 0.09, 64),
      doughMat
    )
    dough.scale.z = 0.78
    dough.castShadow = true
    pizza.add(dough)

    const crust = new THREE.Mesh(
      new THREE.TorusGeometry(0.72, 0.075, 12, 64),
      material('#bd8046')
    )
    crust.rotation.x = Math.PI / 2
    crust.scale.y = 0.78
    crust.position.y = 0.055
    pizza.add(crust)

    const sauce = new THREE.Mesh(
      new THREE.CylinderGeometry(0.66, 0.66, 0.025, 64),
      red
    )
    sauce.scale.z = 0.78
    sauce.position.y = 0.06
    pizza.add(sauce)

    const cheeseLayer = new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 0.6, 0.025, 64),
      cheese
    )
    cheeseLayer.scale.z = 0.78
    cheeseLayer.position.y = 0.08
    pizza.add(cheeseLayer)

    // Pizza toppings
    const toppings = new THREE.Group()
    toppings.position.y = 0.105
    pizza.add(toppings)

    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2
      const radius = 0.42

      const topping = new THREE.Mesh(
        new THREE.CylinderGeometry(0.075, 0.075, 0.035, 20),
        i % 3 === 0 ? red : i % 3 === 1 ? green : material('#7d573e')
      )

      topping.position.set(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius * 0.78
      )

      toppings.add(topping)
    }

    toppings.visible = false

    // Ingredient bowls
    const ingredients = [
      { x: -2.05, color: red, name: 'Tomatoes' },
      { x: -1.25, color: green, name: 'Vegetables' },
      { x: -0.45, color: yellow, name: 'Cheese' },
      { x: 0.45, color: material('#79533b'), name: 'Mushrooms' }
    ]

    ingredients.forEach((item) => {
      const bowl = new THREE.Group()
      bowl.position.set(item.x, 1.13, 0.55)
      scene.add(bowl)

      const bowlMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.17, 0.13, 32),
        steel
      )
      bowl.add(bowlMesh)

      for (let i = 0; i < 4; i++) {
        sphere(
          bowl,
          0.075,
          item.color,
          [
            Math.sin(i * 1.6) * 0.13,
            0.1,
            Math.cos(i * 1.6) * 0.12
          ]
        )
      }
    })

    // Chef character
    const chef = new THREE.Group()
    chef.position.set(-2.35, 0, 0.4)
    scene.add(chef)

    // Legs
    for (const x of [-0.19, 0.19]) {
      cylinder(chef, 0.13, 0.15, 0.82, black, [x, 0.48, 0])
      sphere(chef, 0.16, black, [x, 0.08, 0.1])
    }

    // Body / chef jacket
    const torso = new THREE.Mesh(
      new THREE.CylinderGeometry(0.37, 0.43, 0.95, 32),
      white
    )
    torso.position.y = 1.38
    torso.castShadow = true
    chef.add(torso)

    // Jacket buttons
    for (let i = 0; i < 3; i++) {
      sphere(chef, 0.025, steel, [0.02, 1.65 - i * 0.19, 0.365])
    }

    // Apron
    box(chef, [0.58, 0.7, 0.09], apronMat, [0, 1.18, 0.38])

    // Neck and head
    cylinder(chef, 0.13, 0.14, 0.22, skin, [0, 1.96, 0])

    const head = new THREE.Group()
    head.position.set(0, 2.24, 0)
    chef.add(head)

    sphere(head, 0.32, skin, [0, 0, 0])

    // Ears
    sphere(head, 0.075, skin, [-0.31, 0, 0])
    sphere(head, 0.075, skin, [0.31, 0, 0])

    // Eyes
    const eyeMat = material('#30241e')

    sphere(head, 0.035, eyeMat, [-0.11, 0.06, 0.29])
    sphere(head, 0.035, eyeMat, [0.11, 0.06, 0.29])

    // Nose
    sphere(head, 0.055, skin, [0, -0.035, 0.32])

    // Mouth
    const mouth = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.025, 0.025),
      material('#683e34')
    )
    mouth.position.set(0, -0.15, 0.3)
    head.add(mouth)

    // Chef moustache
    sphere(head, 0.065, black, [-0.065, -0.11, 0.31])
    sphere(head, 0.065, black, [0.065, -0.11, 0.31])

    // White chef hat
    cylinder(chef, 0.31, 0.31, 0.1, white, [0, 2.56, 0])
    sphere(chef, 0.27, white, [0, 2.78, 0])
    sphere(chef, 0.21, white, [0, 2.92, 0])

    // Animated arms
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
        white,
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
        white,
        [0, -0.2, 0]
      )

      sphere(elbow, 0.11, skin, [0, -0.42, 0.02])

      // Hand
      sphere(elbow, 0.095, skin, [0, -0.44, 0.03])

      arms.push({ shoulder, elbow, side })
    }

    // Oven
    const oven = new THREE.Group()
    oven.position.set(2.7, 0, -0.2)
    scene.add(oven)

    box(oven, [1.7, 1.8, 1.5], ovenMat, [0, 0.95, 0])

    // Oven arch
    const arch = new THREE.Mesh(
      new THREE.TorusGeometry(0.55, 0.13, 20, 48, Math.PI),
      material('#9b8170')
    )
    arch.position.set(0, 1.15, 0.77)
    oven.add(arch)

    // Oven opening
    box(
      oven,
      [1.05, 0.9, 0.06],
      material('#17100d'),
      [0, 1.05, 0.77]
    )

    // Fire
    const fireGroup = new THREE.Group()
    fireGroup.position.set(0, 0.9, 0.84)
    oven.add(fireGroup)

    for (let i = 0; i < 7; i++) {
      const flame = new THREE.Mesh(
        new THREE.ConeGeometry(0.12, 0.5 + Math.random() * 0.3, 12),
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

    // Oven stone
    box(oven, [1.4, 0.12, 1.2], material('#b9a18b'), [0, 0.18, 0.05])

    // Wood pizza peel
    const peel = new THREE.Group()
    peel.position.set(1.5, 1.13, 0.3)
    scene.add(peel)

    box(peel, [0.65, 0.035, 0.7], wood, [0, 0, 0])
    cylinder(peel, 0.045, 0.045, 1.05, wood, [0, 0, 0.75])

    // Decorative kitchen lights
    const ceilingLight = new THREE.PointLight('#ffd8a0', 3, 10)
    ceilingLight.position.set(0, 5, 1)
    scene.add(ceilingLight)

    // Animation
    const clock = new THREE.Clock()

    const animate = () => {
      if (disposed) return

      animationFrame = requestAnimationFrame(animate)

      const elapsed = clock.getElapsedTime()
      const phase = elapsed % 28

      // Natural chef body movement
      chef.position.y = Math.sin(elapsed * 1.7) * 0.015
      head.rotation.x = Math.sin(elapsed * 0.8) * 0.04
      head.rotation.y = Math.sin(elapsed * 0.5) * 0.08

      // Ingredient preparation
      if (phase < 6) {
        arms[0].shoulder.rotation.z =
          -0.7 + Math.sin(elapsed * 4) * 0.12

        arms[1].shoulder.rotation.z =
          0.7 + Math.sin(elapsed * 4) * 0.12

        arms[0].elbow.rotation.z = -0.3
        arms[1].elbow.rotation.z = 0.3

        head.rotation.x = 0.15
      }

      // Kneading and stretching dough
      else if (phase < 13) {
        arms[0].shoulder.rotation.z =
          -0.95 + Math.sin(elapsed * 6) * 0.15

        arms[1].shoulder.rotation.z =
          0.95 - Math.sin(elapsed * 6) * 0.15

        arms[0].elbow.rotation.z = Math.sin(elapsed * 5) * 0.3
        arms[1].elbow.rotation.z = -Math.sin(elapsed * 5) * 0.3

        pizza.rotation.y = Math.sin(elapsed * 2) * 0.08
        head.rotation.x = 0.2
      }

      // Adding toppings
      else if (phase < 20) {
        arms[0].shoulder.rotation.z =
          -1 + Math.sin(elapsed * 5) * 0.18

        arms[1].shoulder.rotation.z =
          1 + Math.cos(elapsed * 5) * 0.18

        arms[0].elbow.rotation.z = 0.35
        arms[1].elbow.rotation.z = -0.35

        toppings.visible = true
        head.rotation.x = 0.1
      }

      // Moving pizza towards oven
      else {
        arms[0].shoulder.rotation.z = -0.8
        arms[1].shoulder.rotation.z = 0.8

        arms[0].elbow.rotation.z = -0.5
        arms[1].elbow.rotation.z = 0.5

        peel.rotation.x = Math.sin(elapsed * 2) * 0.04
        head.rotation.x = 0.05
      }

      // Fire flickering
      fireGroup.children.forEach((flame, i) => {
        flame.scale.y = 0.8 + Math.sin(elapsed * 8 + i) * 0.3
        flame.rotation.z = Math.sin(elapsed * 4 + i) * 0.12
      })

      ovenLight.intensity = 10 + Math.sin(elapsed * 5) * 3

      // Camera subtle movement
      camera.position.x = Math.sin(elapsed * 0.2) * 0.12
      camera.lookAt(0, 1.35, 0)

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      if (!container || disposed) return

      const width = container.clientWidth
      const height = container.clientHeight

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    const resizeObserver = new ResizeObserver(handleResize)
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
    <div className="overflow-hidden rounded-2xl border border-[#49372c] bg-[#211b18]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div>
          <p className="text-sm font-bold tracking-wide text-white">
            THE PIZZA KITCHEN
          </p>
          <p className="mt-1 text-xs text-orange-200/70">
            Live preparation scene
          </p>
        </div>

        <span className="flex items-center gap-2 text-xs font-semibold text-green-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
          LIVE
        </span>
      </div>

      <div
        ref={mountRef}
        className="h-[320px] w-full sm:h-[430px]"
      />

      <div className="flex items-center justify-center gap-2 border-t border-white/10 px-3 py-3 text-xs text-orange-100/80">
        <span className="h-2 w-2 animate-pulse rounded-full bg-orange-400" />
        Chef is working on your fresh pizza
      </div>
    </div>
  )
}

const OrderSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const order = location.state?.order

  const [timeLeft, setTimeLeft] = useState(30 * 60)

  useEffect(() => {
    if (!order) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }

        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [order])

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const seconds = String(timeLeft % 60).padStart(2, '0')

  if (!order) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center px-4 text-center font-[Arial]">
        <h2 className="text-2xl font-bold text-gray-900">
          Order Information Not Found
        </h2>

        <p className="mt-2 text-gray-500">
          Please place an order to see your confirmation.
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

        {/* Success */}
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

        {/* 3D Kitchen */}
        <div className="mt-8 text-left">
          <PizzaKitchen />
        </div>

        {/* Timer */}
        <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-5">

          <p className="text-sm font-bold uppercase tracking-wider text-gray-700">
            Estimated Preparation Time
          </p>

          <div className="mt-3 flex items-center justify-center gap-2">

            <div className="min-w-20 rounded-xl bg-white px-4 py-3 shadow-sm">
              <p className="text-4xl font-extrabold tabular-nums text-red-600">
                {minutes}
              </p>
              <p className="mt-1 text-xs font-semibold text-gray-500">
                MINUTES
              </p>
            </div>

            <span className="text-3xl font-bold text-red-600">:</span>

            <div className="min-w-20 rounded-xl bg-white px-4 py-3 shadow-sm">
              <p className="text-4xl font-extrabold tabular-nums text-red-600">
                {seconds}
              </p>
              <p className="mt-1 text-xs font-semibold text-gray-500">
                SECONDS
              </p>
            </div>

          </div>

          <p className="mt-4 text-sm font-medium text-gray-600">
            {timeLeft > 0
              ? 'Your delicious pizza is getting ready!'
              : 'Your estimated preparation time is over!'}
          </p>
        </div>

        {/* Order Details */}
        <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-5 text-left">

          <div className="flex items-center gap-2 text-gray-900">
            <FaClipboardList className="text-red-600" />
            <span className="font-bold">Order Details</span>
          </div>

          <div className="mt-5 space-y-4 text-sm">

            <div className="flex justify-between gap-3">
              <span className="text-gray-500">Order Number</span>
              <span className="break-all text-right font-bold text-gray-900">
                {order.orderNumber}
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span className="text-gray-500">Customer</span>
              <span className="font-semibold text-gray-900">
                {order.customer?.name}
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span className="text-gray-500">Payment Method</span>
              <span className="font-semibold text-gray-900">
                Cash on Delivery
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span className="text-gray-500">Order Status</span>
              <span className="font-semibold text-orange-600">
                {order.orderStatus}
              </span>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between gap-3">
                <span className="font-bold text-gray-900">
                  Total Amount
                </span>

                <span className="text-lg font-bold text-red-600">
                  Rs. {Number(order.totalAmount).toLocaleString()}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Continue Shopping */}
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
