import * as THREE from './three.module.js';
import { OrbitControls } from './OrbitControls.js';
import { OBJLoader } from './OBJLoader.js';

function loadMesh(filePath, scene, camera, controls, options) {
    const loader = new OBJLoader();
    loader.load(filePath, (obj) => {
        const box = new THREE.Box3().setFromObject(obj);
        const sphere = box.getBoundingSphere(new THREE.Sphere());
        obj.position.sub(sphere.center);
        
        let minY = Infinity;
        let maxY = -Infinity;

        obj.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                const positions = child.geometry.attributes.position.array;
                for (let i = 0; i < positions.length; i += 3) {
                    // x=i, y=i+1, z=i+2
                    const y = positions[i + 1];
                    minY = Math.min(minY, y);
                    maxY = Math.max(maxY, y);
                }
            }
        });
        
        obj.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                const geometry = child.geometry;

                const positions = geometry.attributes.position.array;
                const vertexCount = positions.length / 3;
                const colors = [];

                const c1 = new THREE.Color(options.color1);
                const c2 = new THREE.Color(options.color2);
                const tmpColor = new THREE.Color();

                for (let vi = 0; vi < vertexCount; vi++) {
                    const y = positions[vi * 3 + 1];
                    let normalizedY = 0;
                    if (maxY !== minY) normalizedY = (y - minY) / (maxY - minY);
                    tmpColor.lerpColors(c1, c2, normalizedY);
                    colors.push(tmpColor.r, tmpColor.g, tmpColor.b);
                }

                if (!options.disableRecolor) geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

                if (typeof geometry.computeVertexNormals === 'function') {
                    geometry.computeVertexNormals();
                }

                const material = new THREE.MeshStandardMaterial({
                    vertexColors: true,
                    side: THREE.DoubleSide,
                    polygonOffset: true,
                    polygonOffsetFactor: 1,
                    polygonOffsetUnits: 1,
                    metalness: typeof options.metalness === 'number' ? options.metalness : 0.0,
                    roughness: typeof options.roughness === 'number' ? options.roughness : 1.0,
                    flatShading: true,
                });

                child.material = material;

                if (options.wireframe) {
                    const wireframeGeometry = new THREE.WireframeGeometry(child.geometry);
                    const wireframeMaterial = new THREE.LineBasicMaterial({ 
                        transparent: true,
                        opacity: 0.3,
                        color: options.wireframeColor,
                        linewidth: options.wireframeLinewidth
                    });
                    const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
                    child.add(wireframe);
                }
            }
        });

        
        scene.add(obj);
        camera.position.set(0, 0, sphere.radius * 3);
        const target = new THREE.Vector3(0, 0, 0);
        controls.target.copy(target);
        controls.update();
    });
}

function parsePointCloudData(data, options) {
    const lines = data.split('\n');
    const points = [];
    
    for (const line of lines) {
        const trimmedLine = line.trim();
        
        if (!trimmedLine || trimmedLine.startsWith('#') || trimmedLine.startsWith('//')) {
            continue;
        }
        
        const coords = trimmedLine.split(/\s+/).map(parseFloat).filter(num => !isNaN(num));
        
        if (coords.length >= 3 && !isNaN(coords[0]) && !isNaN(coords[1]) && !isNaN(coords[2])) {
            points.push(coords[options.pcVtxOrder[0]], coords[options.pcVtxOrder[1]], coords[options.pcVtxOrder[2]]);
        }
    }
    
    return points;
}

function loadPointCloud(filePath, scene, camera, controls, options) {
    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            const points = parsePointCloudData(data, options);
            const geometry = new THREE.BufferGeometry();
            
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
            
            let minZ = Infinity;
            let maxZ = -Infinity;
            for (let i = 1; i < points.length; i += 3) {
                const z = points[i];
                minZ = Math.min(minZ, z);
                maxZ = Math.max(maxZ, z);
            }
            
            const colors = [];
            for (let i = 1; i < points.length; i += 3) {
                const z = points[i];
                const range = maxZ - minZ;
                const normalizedZ = range === 0 ? 0 : (z - minZ) / range;
                
                const color = new THREE.Color();
                color.lerpColors(
                    new THREE.Color(options.color1), 
                    new THREE.Color(options.color2), 
                    normalizedZ
                );
                
                colors.push(color.r, color.g, color.b);
            }
            
            if(!options.disableRecolor) geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
            
            const material = new THREE.PointsMaterial({
                vertexColors: true,
                size: options.pointSize,
                sizeAttenuation: true
            });
            
            const pointCloud = new THREE.Points(geometry, material);
            scene.add(pointCloud);
            
            const box = new THREE.Box3().setFromObject(pointCloud);
            const sphere = box.getBoundingSphere(new THREE.Sphere());
            const center = sphere.center;
            const radius = sphere.radius;
            
            pointCloud.position.sub(center);
            camera.position.set(0, 0, radius * 3);
            controls.target.copy(new THREE.Vector3(0, 0, 0));
            controls.update();
        })
        .catch(error => {
            console.error('Error loading point cloud:', error);
        });
}

function createObjViewer(containerSelector, objPath, options = {}) {
    const defaultOptions = {
        autoRotateSpeed: 1.0,
        wireframe: true,
        backgroundColor: 0xFFFFFF,
        wireframeColor: 0x1f1f1f,
        wireframeLinewidth: 0.0000001,
        pointcloud: false,
        pointSize: 0.001,
        pcVtxOrder: [0, 1, 2],
        color1: 0x72258D,
        color2: 0x72E1FF,
        // PBR material properties (used when rendering meshes)
        metalness: 0.3,
        roughness: 0.8,
        flatShading: false,
        // auto merge nearby vertices to restore shared vertices (improves smooth shading)
        mergeVertices: true,
        mergeTolerance: 0.01,
        disableRecolor: false,
        fov: 38,
        minDistance: 0.1,
        maxDistance: 3.0,
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    const container = typeof containerSelector === 'string' ? document.querySelector(containerSelector) : containerSelector;
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    
    renderer.setClearColor(finalOptions.backgroundColor);
    
    const w = container.clientWidth || container.offsetWidth || 640;
    const h = container.clientHeight || 480;
    renderer.setSize(w, h);
    container.appendChild(renderer.domElement);
    
    const camera = new THREE.PerspectiveCamera(finalOptions.fov, w / h, 0.01, 1000);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.minDistance = finalOptions.minDistance;
    controls.maxDistance = finalOptions.maxDistance;
    controls.autoRotateSpeed = finalOptions.autoRotateSpeed;
    controls.addEventListener('start', () => { controls.autoRotate = false; });
    controls.addEventListener('end', () => { controls.autoRotate = true; });

    const setLight = () => {
        const ambient = new THREE.AmbientLight(0xFFFFFF, 5.5)
        scene.add(ambient);
    };
    setLight();
    
    if (finalOptions.pointcloud) {
        loadPointCloud(objPath, scene, camera, controls, finalOptions);
    } else {
        loadMesh(objPath, scene, camera, controls, finalOptions);
    }
    
    function onResize() {
        const w2 = container.clientWidth || container.offsetWidth || 640;
        const h2 = container.clientHeight || 480;
        renderer.setSize(w2, h2);
        camera.aspect = w2 / h2;
        camera.updateProjectionMatrix();
    }
    
    window.addEventListener('resize', onResize);
    
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    
    onResize();
    animate();
    
    return { 
        scene, 
        camera, 
        renderer, 
        controls,
        update: (newObjPath) => {
            scene.clear();
            setLight();
            if (finalOptions.pointcloud) {
                loadPointCloud(newObjPath, scene, camera, controls, finalOptions);
            } else {
                loadMesh(newObjPath, scene, camera, controls, finalOptions);
            }
        }
    };
}

export { createObjViewer };