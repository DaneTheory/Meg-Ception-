var vertexShader = [

			"#define PHONG",

			"varying vec3 vViewPosition;",
			"varying vec3 vNormal;",

			"uniform float radius;",
			"uniform float distance;",

			THREE.ShaderChunk[ "map_pars_vertex" ],
			THREE.ShaderChunk[ "lightmap_pars_vertex" ],
			THREE.ShaderChunk[ "envmap_pars_vertex" ],
			THREE.ShaderChunk[ "lights_phong_pars_vertex" ],
			THREE.ShaderChunk[ "color_pars_vertex" ],
			THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
			THREE.ShaderChunk[ "skinning_pars_vertex" ],
			THREE.ShaderChunk[ "shadowmap_pars_vertex" ],

			"void main() {",

				THREE.ShaderChunk[ "map_vertex" ],
				THREE.ShaderChunk[ "lightmap_vertex" ],
				THREE.ShaderChunk[ "color_vertex" ],

				THREE.ShaderChunk[ "morphnormal_vertex" ],
				THREE.ShaderChunk[ "skinbase_vertex" ],
				THREE.ShaderChunk[ "skinnormal_vertex" ],
				THREE.ShaderChunk[ "defaultnormal_vertex" ],

				"vNormal = normalize( transformedNormal );",

				THREE.ShaderChunk[ "morphtarget_vertex" ],
				THREE.ShaderChunk[ "skinning_vertex" ],

				"vec4 mvPosition;",

				"#ifdef USE_SKINNING",

					"mvPosition = modelViewMatrix * skinned;",

				"#endif",

				"#if !defined( USE_SKINNING ) && defined( USE_MORPHTARGETS )",

					"mvPosition = modelViewMatrix * vec4( morphed, 1.0 );",

				"#endif",

				"#if !defined( USE_SKINNING ) && ! defined( USE_MORPHTARGETS )",

					
					"vec4 mwPosition = modelMatrix * vec4( position, 1.0 );",

					"float inradius = radius - mwPosition.y;",
					"float bound = max( 0.0, distance );",
					"vec2 origin = vec2( 0.0 );",

					"vec2 dir = vec2( 0.0, mwPosition.z ) - vec2( 0.0, origin.y );",
					"float d = length( dir );",
					"float amount = step( bound, d );",
					"float theta = max( d - bound, 0.0 ) / radius;",
					"float elev = ( radius - ( cos( theta ) * inradius ) );",
					"float depth = sin( theta ) * inradius;",
					"dir = normalize( dir ) * ( min( d, bound ) + depth );",

					"vec4 newPosition = vec4( mwPosition.x, elev, dir.y, 1.0 );",
					"mvPosition = viewMatrix * newPosition;",


				"#endif",

				"gl_Position = projectionMatrix * mvPosition;",

				"vViewPosition = -mvPosition.xyz;",

				THREE.ShaderChunk[ "worldpos_vertex" ],
				THREE.ShaderChunk[ "envmap_vertex" ],
				THREE.ShaderChunk[ "lights_phong_vertex" ],
				THREE.ShaderChunk[ "shadowmap_vertex" ],

			"}"

		].join("\n")

		var phongMaterial = new THREE.MeshPhongMaterial({ 
			ambient: 0x000000,
			color: 0xffffff,
			specular: 0x555555,
			shininess: 30,
			shading: THREE.FlatShading
			// wireframe: true,
			// side: THREE.DoubleSide
		});


		var phong = THREE.ShaderLib['phong'];
		var uniforms = THREE.UniformsUtils.merge( [

			phong.uniforms,

			{
				"radius" :  { type: "f", value: 10000.0 },
				"distance" :  { type: "f", value: 300.0 },
			}
		]);


		shaderMaterial = new THREE.ShaderMaterial({
			uniforms: uniforms,
			vertexShader: vertexShader,
			fragmentShader: phong.fragmentShader,
			shading: phongMaterial.shading,
			ambient: new THREE.Color( 0xaaaaaa ),
			
			color: new THREE.Color( 0xaaaaaa ),
			specular: new THREE.Color( 0xaaaaaa ),
			shininess: 30,

			lights: true,
			fog: true,

			metal: false,
			perPixel: true,
			side: THREE.FrontSide,

			wrapAround: false,
			wrapRGB: new THREE.Vector3( 1, 1, 1 ),

			map: null,

			lightMap: null,

			bumpMap: null,
			bumpScale: 1,

			normalMap: null,
			normalScale: new THREE.Vector2( 1, 1 ),

			specularMap: null,

			envMap: null,
			combine: THREE.MultiplyOperation,
			reflectivity: 1,
			refractionRatio: 0.98,

			wireframe: false,
			wireframeLinewidth: 1,
			wireframeLinecap: 'round',
			wireframeLinejoin: 'round',

			vertexColors: THREE.FaceColors,

			skinning: false,
			morphTargets: false,
			morphNormals: false
		})

		shaderMaterial.emissive = new THREE.Color( 0x000000 ),
		shaderMaterial.emissive.setHSV( 0, 0, 0.35 );

		shaderMaterial1 = shaderMaterial.clone();
		// shaderMaterial1.wireframe = true;