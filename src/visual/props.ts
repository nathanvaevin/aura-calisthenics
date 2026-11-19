/**
 * The equipment a movement is performed on: plain, dark, and no more than
 * the exercise needs. A movement lists its props; the player builds them.
 */
import { BoxGeometry, CylinderGeometry, Group, Mesh, MeshStandardMaterial, PlaneGeometry, TorusGeometry } from 'three'
import type { Prop } from './motions/types'

const metal = new MeshStandardMaterial({ color: 0x2a2b33, roughness: 0.35, metalness: 0.85 })
const matt = new MeshStandardMaterial({ color: 0x1b1c22, roughness: 0.85, metalness: 0.05 })
const wall = new MeshStandardMaterial({ color: 0x14151b, roughness: 0.95, metalness: 0 })

const rod = (radius: number, length: number, segments = 18) => {
  const m = new Mesh(new CylinderGeometry(radius, radius, length, segments), metal)
  m.castShadow = true
  return m
}

export function buildProps(props: Prop[]): Group {
  const group = new Group()
  for (const p of props) {
    if (p.kind === 'bar') {
      // Across the stage, on two posts.
      const rail = rod(p.radius, p.width + 0.3)
      rail.rotation.z = Math.PI / 2
      rail.position.set(0, p.height, p.z ?? 0)
      group.add(rail)
      for (const side of [-1, 1]) {
        const post = rod(0.028, p.height + 0.1, 14)
        post.position.set(side * (p.width / 2 + 0.15), (p.height + 0.1) / 2, p.z ?? 0)
        group.add(post)
      }
    } else if (p.kind === 'rails') {
      // Two rails running front to back: dip bars, or parallettes when low and short.
      for (const side of [-1, 1]) {
        const rail = rod(p.radius, p.length)
        rail.rotation.x = Math.PI / 2
        rail.position.set(side * p.gap / 2, p.height, p.z ?? 0)
        group.add(rail)
        for (const end of [-1, 1]) {
          const post = rod(p.height > 0.5 ? 0.024 : 0.014, p.height, 12)
          post.position.set(side * p.gap / 2, p.height / 2, (p.z ?? 0) + end * (p.length / 2 - 0.04))
          group.add(post)
        }
      }
    } else if (p.kind === 'box') {
      const box = new Mesh(new BoxGeometry(p.width, p.height, p.depth), matt)
      box.position.set(p.x ?? 0, p.height / 2, p.z)
      box.castShadow = true
      box.receiveShadow = true
      group.add(box)
    } else if (p.kind === 'wall') {
      // Seen only from the athlete's side: from behind it would hide them.
      const w = new Mesh(new PlaneGeometry(3.2, p.height ?? 2.7), wall)
      w.position.set(0, (p.height ?? 2.7) / 2, p.z)
      if (p.z > 0) w.rotation.y = Math.PI
      w.receiveShadow = true
      group.add(w)
    } else if (p.kind === 'rings') {
      // Two rings on straps. They hang still: the movement is written round where they are.
      for (const side of [-1, 1]) {
        const ring = new Mesh(new TorusGeometry(p.radius, 0.014, 10, 32), matt)
        ring.position.set(side * p.gap / 2, p.height, p.z ?? 0)
        ring.rotation.y = Math.PI / 2
        ring.castShadow = true
        const strap = new Mesh(new BoxGeometry(0.004, Math.max(0.01, p.top - p.height - p.radius), 0.03), matt)
        strap.position.set(side * p.gap / 2, (p.top + p.height + p.radius) / 2, p.z ?? 0)
        group.add(ring, strap)
      }
    } else if (p.kind === 'band') {
      // A band from a fixed point to a joint: the player stretches it between the two every frame.
      const band = new Mesh(new BoxGeometry(0.03, 1, 0.006), new MeshStandardMaterial({ color: 0x8a2f2a, roughness: 0.7, metalness: 0 }))
      band.name = 'band'
      band.userData = { x: p.x, height: p.height, z: p.z ?? 0, to: p.to }
      group.add(band)
    } else {
      // An ab wheel: the player rolls it along under the hands.
      const wheel = new Group()
      const tyre = new Mesh(new TorusGeometry(p.radius - 0.012, 0.012, 10, 28), matt)
      tyre.rotation.y = Math.PI / 2
      const axle = rod(0.014, 0.42, 12)
      axle.rotation.z = Math.PI / 2
      wheel.add(tyre, axle)
      wheel.name = 'wheel'
      wheel.userData.radius = p.radius
      group.add(wheel)
    }
  }
  return group
}
