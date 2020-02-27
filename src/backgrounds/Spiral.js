import React from 'react';
import * as THREE from "three";

const Spiral = () => {

    let camera, scene, renderer, clock, particles, material;

    const particleCount = 50000;
    const radius = 600;
    const myVertexShader = React.createRef();
    const myFragmentShader = React.createRef();

    const init = () => {

        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 1000;

        scene = new THREE.Scene();

        clock = new THREE.Clock();

        // texture

        const loader = new THREE.TextureLoader()
        const sprite = loader.load('https://threejs.org/examples/textures/sprites/circle.png', animate);

        // material

        material = new THREE.ShaderMaterial({
            uniforms: {
                map: {
                    value: sprite
                },
                globalTime: {
                    value: 0
                },
                baseColor: {
                    value: new THREE.Color(0xffffff)
                }
            },
            vertexShader: myVertexShader,
            fragmentShader: myFragmentShader,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true,
            vertexColors: THREE.VertexColors
        });

        // geometry

        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const colors = [];
        const times = [];

        const point = new THREE.Vector3();
        const color = new THREE.Color();

        for (let i = 0; i < particleCount; i++) {

            getRandomPointOnSphere(radius, point);

            color.setHSL(i / particleCount, 0.7, 0.7);

            vertices.push(point.x, point.y, point.z);
            colors.push(color.r, color.g, color.b);
            times.push(i / particleCount);

        }

        geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.addAttribute('time', new THREE.Float32BufferAttribute(times, 1));

        // particles

        particles = new THREE.Points(geometry, material);
        scene.add(particles);

        //

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        //

        window.addEventListener('resize', onWindowResize, false)

    }

    const onWindowResize = () => {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }

    const animate = () => {

        requestAnimationFrame(animate);

        const delta = clock.getDelta();

        material.uniforms.globalTime.value += delta * 0.1;

        particles.rotation.z += 0.015;

        renderer.render(scene, camera);

    }

    const getRandomPointOnSphere = (r, v) => {

        var angle = Math.random() * Math.PI * 2;
        var u = Math.random() * 2 - 1;

        v.x = Math.cos(angle) * Math.sqrt(1 - Math.pow(u, 2)) * r;
        v.y = Math.sin(angle) * Math.sqrt(1 - Math.pow(u, 2)) * r;
        v.z = u * r;

    }


    init();
    return (
        <div>
            <div type="x-shader/x-vertex" ref={myVertexShader} />
            <div type="x-shader/x-fragment" ref={myFragmentShader} />
        </div>
    );

};

export default Spiral;