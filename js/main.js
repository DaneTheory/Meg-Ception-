window.onload = function() {

	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

	var SCREEN_WIDTH = window.innerWidth;
	var SCREEN_HEIGHT = window.innerHeight;

	var SCALE = 1;

	var container, stats;

	var camera, scene, renderer, material, geo, mesh, camTarget;

	var clock = new THREE.Clock();

 	


	function init() {

		container = document.getElementById( 'container' );

		var FAR = 10000;

		// CAMERA
		camera = new THREE.PerspectiveCamera( 75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, FAR );
		camera.position.z = 35;
		camera.position.y = 1.5;
		camTarget = new THREE.Vector3();
		

		// SCENE
		scene = new THREE.Scene();
		scene.add( camera );


		// LIGHTS
		var ambient = new THREE.AmbientLight( 0xEFEFEF );
		ambient.color.setHSV( 0.75, 0.1, 0.75 );
		ambient.position.set(0,0,0).normalize();
		ambient.position.multiplyScalar( 6 );
		scene.add( ambient );
		
				 
		var dirLight = new THREE.DirectionalLight( 0xEFEFEF, 1 );
		dirLight.position.set( 1, 1, 1 );
		scene.add( dirLight );

		var dirLight2 = new THREE.DirectionalLight( 0xEFEFEF );
		dirLight2.position.set( 25, 25.5, 25 );

		var dirLight3 = new THREE.DirectionalLight( 0xFFFFFF );
		dirLight2.position.set( 0, 0, 0 );

		dirLight2.castShadow = true;
		dirLight2.onlyShadow = true;
		dirLight2.shadowCameraVisible = true;
		dirLight2.shadowCameraNear = 2.1;
		dirLight2.shadowCameraFar = 500;
		dirLight2.shadowDarkness = 0.25;
		dirLight2.shadowMapWidth = 1048;
		dirLight2.shadowMapHeight = 1048;

		dirLight3.castShadow = true;
		dirLight3.onlyShadow = false;
		dirLight3.shadowCameraVisible = true;
		dirLight3.shadowCameraNear = 0;
		dirLight3.shadowCameraFar = 20000;
		dirLight3.shadowDarkness = 0.15;
		dirLight3.shadowMapWidth = 20000;
		dirLight3.shadowMapHeight = 20000;

		
		
		//SKYBOX
		var imagePrefix = "../images/skybox/";
	    var directions  = ["posx", "negx", "posy", "negy", "posz", "negz"];
	    var imageSuffix = ".png";
	    var skyGeometry = new THREE.CubeGeometry( 20000,20000,20000 );
	    var materialArray = [];
			for (var i = 0; i < 6; i++)
		        materialArray.push( new THREE.MeshBasicMaterial({
			        map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
			        side: THREE.BackSide
	        	 }));
			var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
	        var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
		scene.add( skyBox ); //Adds SkyBox To Scene
		
		// GROUND PLANE
		var groundGeo = new THREE.PlaneGeometry( 12, 600, 1, 100 );
		applyColor( groundGeo, 0, 0, 0.4 );

		var mesh = new THREE.Mesh( groundGeo, shaderMaterial1 );
		mesh.rotation.x = -Math.PI/2;
		mesh.position.y = -2.5;
		mesh.position.z = 300;

		mesh.receiveShadow = true;

		scene.add( mesh );

		
		// REVERSE GROUND PLANE
		var sideGeo = new THREE.PlaneGeometry( 100, 600, 100, 100/*, 1, shaderMaterial, { ny: false } */);

		// SIDEWALK
		var sideGeo = new THREE.CubeGeometry( 4, 1, 600, 1, 1, 100 );
		applyColor( sideGeo, 10, 10, 0.65 );

		var mesh = new THREE.Mesh( sideGeo, shaderMaterial1 );
		mesh.position.y = -2.95;
		mesh.position.x = 2 + 6;
		mesh.position.z = 300;
		mesh.receiveShadow = true;
		scene.add( mesh );

		var mesh = new THREE.Mesh( sideGeo, shaderMaterial1 );
		mesh.position.y = -2.95;
		mesh.position.x = - ( 2 + 6 );
		mesh.position.z = 300;
		mesh.receiveShadow = true;
		scene.add( mesh );

		var curbGeo = new THREE.CubeGeometry( 0.25, 1.25, 600, 1, 1, 100 );
		applyColor( curbGeo, 10, 10, 0.85 );

		var mesh = new THREE.Mesh( curbGeo, shaderMaterial1 );
		mesh.position.y = -2.95;
		mesh.position.x = -6;
		mesh.position.z = 300;
		mesh.receiveShadow = true;
		scene.add( mesh );

		var mesh = new THREE.Mesh( curbGeo, shaderMaterial1 );
		mesh.position.y = -2.95;
		mesh.position.x = 6;
		mesh.position.z = 300;
		mesh.receiveShadow = true;
		scene.add( mesh );

		// ROAD
		var geo = new THREE.PlaneGeometry( 0.6, 10, 1, 3 );
		var mergedGeo = new THREE.Geometry();

		for( var i = 0 ; i < 10 ; i++ )
		{
			mesh = new THREE.Mesh( geo, shaderMaterial );
			mesh.position.y = i * -15;
			applyColor( geo, 10, 10, 10 );

			THREE.GeometryUtils.merge( geo, mesh );
		}

		var mesh = new THREE.Mesh( geo, shaderMaterial1 );
		mesh.rotation.x = -Math.PI/2;
		mesh.position.y = -2;
		
		scene.add( mesh );

		var mergedGeo = new THREE.Geometry();

		// BUI:DINGS
		var a = 1;
		var cubeGeo = new THREE.CubeGeometry( a, a, a, 1, 1, 1 );
		var mesh;
		for ( var i = 0; i < 10000; i ++ ) {

			var sy = 1 + Math.sin( 0.35 * Math.random() ) * 70;
			var sx = 1 * 5;
			var sz = 1 + 5 * Math.random();

			mesh = new THREE.Mesh( cubeGeo, shaderMaterial );

			mesh.position.x = ( Math.random() < 0.5 ? 1 : -1 ) * THREE.Math.randFloat( 11, 200 );

			mesh.position.y = 0.5 * ( sy * a );
			mesh.position.z = 600 * Math.random();

			mesh.scale.set( sx, sy, sz );

			mesh.matrixAutoUpdate = true;
			mesh.updateMatrix();

			var h = 0.52;
			var v = 0.5 + 0.75 * Math.random();
			var s = Math.random() < 0.05 ? 1: 0;

			applyColor( cubeGeo, h, 0, v );

			THREE.GeometryUtils.merge( mergedGeo, mesh );

		}

		// LAMP POSTS
		var b = 4;
		var c = 1;

		var cubeGeo2 = new THREE.CubeGeometry( 0.1, b, 0.1, 1, 1, 1);
		var cubeGeo3 = new THREE.CubeGeometry( 0.15, c, 0.15, 1, 1, 1);
		var cubeGeo4 = new THREE.CubeGeometry( 0.25, 0.25, 0.25, 1, 1, 1);

		function addPart( geo, x, y, z, h, s, v ) {

			var mesh = new THREE.Mesh( geo, shaderMaterial );

			mesh.position.set( x, y, z );

			mesh.matrixAutoUpdate = false;
			mesh.updateMatrix();

			applyColor( geo, h, s, v );

			THREE.GeometryUtils.merge( mergedGeo, mesh );

		}

		var mesh = new THREE.Mesh( mergedGeo, shaderMaterial );
		mesh.position.y = -2.95;
		scene.add( mesh );

		//

		var mergedGeo = new THREE.Geometry();

		var x, y, z, h, s, v;
		var xd = 6.5;

		var points = [];

		for ( var i = 0; i < 35; i ++ ) {

			//

			x = xd;
			y = b * 0.5;
			z = i * 10;

			h = 0.05;
			s = 0.1;
			v = 0.5;

			//Bottom Piece Left
			addPart( cubeGeo2, x, y, z, h, s, v );

			x = xd;
			y = c * 0.5;
			z = i * 10;

			h = 0;
			s = 0.35;
			v = 0.5;

			// Light Bulb Left
			addPart( cubeGeo3, x, y, z, h, s, v );

			y = b;

			s = 40 * Math.sin() / Math.random();
			v = 0.95;

			// Main Pole left
			addPart( cubeGeo4, x, y, z, h, s, v );

			points.push( new THREE.Vector3( x+0.2, y, z+0.2 ) );
			points.push( new THREE.Vector3( x+0.2, y, z-0.2 ) );
			points.push( new THREE.Vector3( x-0.2, y, z-0.2 ) );
			points.push( new THREE.Vector3( x-0.2, y, z+0.2 ) );


			x = -xd;
			y = b * 0.5;
			z = i * 10;

			h = 0.05 * Math.random();
			s = 0.1;
			v = 0.5;

			addPart( cubeGeo2, x, y, z, h, s, v );

			x = -xd;
			y = c * 0.5;
			z = i * 10;

			h = 0;
			s = 0.35;
			v = 0.5;

			addPart( cubeGeo3, x, y, z, h, s, v );

			y = b;

			s = 40 * Math.sin() / Math.random();
			v = 0.95;

			addPart( cubeGeo4, x, y, z, h, s, v );

			points.push( new THREE.Vector3( x+0.2, y, z+0.2 ) );
			points.push( new THREE.Vector3( x+0.2, y, z-0.2 ) );
			points.push( new THREE.Vector3( x-0.2, y, z-0.2 ) );
			points.push( new THREE.Vector3( x-0.2, y, z+0.2 ) );

		}


		var mesh = new THREE.Mesh( mergedGeo, shaderMaterial );
		mesh.position.y = -2.95;
		mesh.castShadow = true;
		scene.add( mesh );

		var particleGeo = new THREE.Geometry();

		for ( var i = 0; i < points.length; i ++ ) {

			var vertex = new THREE.Vector3( points[ i ] );
			particleGeo.vertices[ i ] = vertex;

		}

		var map = THREE.ImageUtils.loadTexture( "images/lensflare0_alpha.png" );
		var particleMaterial = new THREE.ParticleBasicMaterial( { size: 2.5, color: 0xffffff, map: map, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false } );

		var particles = new THREE.ParticleSystem( particleGeo, particleMaterial );
		particles.position.y = -2.95;
		scene.add( particles );

		
		scene.fog = new THREE.Fog( 0x000000, 100, FAR );
		

		// SCENE REDNDERER
		renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
		renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
		renderer.setClearColor( 0xFFFFFF );
		renderer.domElement.style.position = "absolute";
		renderer.domElement.style.left = "0px";
		container.appendChild( renderer.domElement );

		renderer.gammaInput = true;
		renderer.gammaOutput = true;
		renderer.physicallyBasedShading = true;

		controls = new THREE.FirstPersonControls( camera, renderer.domElement );
	    controls.dynamicDampingFactor = 0.2;
		controls.movementSpeed = 0.0001;
		controls.constrainVertical = true;

		var range = 0.8 * Math.PI;
		controls.verticalMin = ( Math.PI - range ) / 2;
		controls.verticalMax = Math.PI - (( Math.PI - range ) / 2);

		// composer
		renderTargetParametersRGB  = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat };
		renderTargetParametersRGBA = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat };
		depthTarget = new THREE.WebGLRenderTarget( SCALE * SCREEN_WIDTH, SCALE * SCREEN_HEIGHT, renderTargetParametersRGBA );
		colorTarget = new THREE.WebGLRenderTarget( SCALE * SCREEN_WIDTH, SCALE * SCREEN_HEIGHT, renderTargetParametersRGBA );
		
		composer = new THREE.EffectComposer( renderer, colorTarget );

		var renderPass = new THREE.RenderPass( scene, camera );
		var hTiltShiftPass = new THREE.ShaderPass( THREE.HorizontalTiltShiftShader );
		var vTiltShiftPass = new THREE.ShaderPass( THREE.VerticalTiltShiftShader );
		var fxaaPass = new THREE.ShaderPass( THREE.FXAAShader );

		// composer.addPass( renderPass );
		composer.addPass( fxaaPass );
		composer.addPass( hTiltShiftPass );
		composer.addPass( vTiltShiftPass );

		bluriness = 5;

		hTiltShiftPass.uniforms[ 'h' ].value = bluriness / ( SCALE * SCREEN_WIDTH );
		vTiltShiftPass.uniforms[ 'v' ].value = bluriness / ( SCALE * SCREEN_HEIGHT );
		hTiltShiftPass.uniforms[ 'r' ].value = vTiltShiftPass.uniforms[ 'r' ].value = 0.5;
		fxaaPass.uniforms[ 'resolution' ].value.set( 1 / ( SCALE * SCREEN_WIDTH ), 1 / ( SCALE * SCREEN_HEIGHT ) );

		composer.passes[composer.passes.length-1].renderToScreen = true;
		

		// gui
		
		api = {}
		api.radius = 150;
		api.curl = 300;

		var gui = new dat.GUI();
		gui.add( api, 'curl', 10, 1000 ).listen();

		window.addEventListener( 'resize', onWindowResize, false );

		function onWindowResize( event ) {

			SCREEN_WIDTH = window.innerWidth;
			SCREEN_HEIGHT = window.innerHeight;

			renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

			camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
			camera.updateProjectionMatrix();

			depthTarget = new THREE.WebGLRenderTarget( SCALE * SCREEN_WIDTH, SCALE * SCREEN_HEIGHT, renderTargetParametersRGBA );
			colorTarget = new THREE.WebGLRenderTarget( SCALE * SCREEN_WIDTH, SCALE * SCREEN_HEIGHT, renderTargetParametersRGB );

			hTiltShiftPass.uniforms[ 'h' ].value = bluriness / ( SCALE * SCREEN_WIDTH );
			vTiltShiftPass.uniforms[ 'v' ].value = bluriness / ( SCALE * SCREEN_HEIGHT );
			fxaaPass.uniforms[ 'resolution' ].value.set( 1 / ( SCALE * SCREEN_WIDTH ), 1 / ( SCALE * SCREEN_HEIGHT ) );
			 effectSSAO.uniforms[ 'size' ].value.set( SCALE * SCREEN_WIDTH, SCALE * SCREEN_HEIGHT );

			composer.reset( colorTarget );
			
			

		}

	}

	function applyColor( geo, h, s, v ) {

		for ( var j = 0, jl = geo.faces.length; j < jl; j ++ ) {

			geo.faces[ j ].color.setHSV( h, s, v );

		}

	}



	function animate() {

		requestAnimationFrame( animate );

		render();

	}

	var time
	function render() {

		time = Date.now() - now;
		api.curl = ( 1.0 - ( 0.5 * Math.sin( time * 0.0001 + 0.5 ) + 0.5 )) * 600 + 50;

		controls.update( 0.65 );
		shaderMaterial1.uniforms['radius'].value = shaderMaterial.uniforms['radius'].value = api.radius;
		shaderMaterial1.uniforms['distance'].value = shaderMaterial.uniforms['distance'].value = api.curl;			
		renderer.render( scene, camera, composer.renderTarget2, true );
		composer.render( 0.3 )

	}

	
	init();
	now = Date.now();
	animate();
}


$(document).ready( function()
{	

	$('.toggle-about' ).click( function(){
		
		$('#about-section').slideToggle( 10 );
		return false;
	});
	

	$( '#overlay-title' ).fitText( 0.5 );

});
