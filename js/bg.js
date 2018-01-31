class Magic {
  
  constructor() {
    console.clear()
    
    this.scene
    this.camera
    this.renderer
    this.composer
    this.glitch
    this.stats
    this.gui
    this.uniforms
    this.speed         = 0.02
    this.intensity     = 0.5
    this.mousePosition = true
    this.wildGlitch    = false
    this.color         = [ 137, 188, 222 ]
    this.offset        = { x: 3, y: 3 }
    this.mouse         = { x: 0, y: 0 }
    this.innerWidth    = window.innerWidth
    this.innerHeight   = window.innerHeight
    this.container     = document.getElementById( 'canvas' )
  }

  begin() {
    this.scene = new THREE.Scene()
    
    this.camera = new THREE.PerspectiveCamera( 50, this.innerWidth / this.innerHeight, 0.5, 1000 )
    this.camera.position.set( 0, 0, 1 )

    this.scene.add( this.camera )
    
    this.renderer = new THREE.WebGLRenderer( { antialias: true, preserveDrawingBuffer: true } )
    this.renderer.domElement.addEventListener( 'mousemove', ::this.onMouseMove, false )
    this.renderer.setSize( this.innerWidth, this.innerHeight )
    this.renderer.setPixelRatio( window.devicePixelRatio )
    this.renderer.setClearColor( 0x000000 )
    this.renderer.clear()
    this.container.appendChild( this.renderer.domElement )
    
    this.composer = new THREE.EffectComposer( this.renderer )
    this.composer.addPass( new THREE.RenderPass( this.scene, this.camera ) )
  
    this.glitch = new THREE.GlitchPass(64)
    this.glitch.renderToScreen = true
    this.glitch.goWild = this.wildGlitch
    this.composer.addPass( this.glitch )

    window.addEventListener( 'resize', ::this.resize, false )

    this.stats = new Stats()
    this.stats.domElement.style.position = 'absolute'
    this.stats.domElement.style.left = '0px'
    this.stats.domElement.style.top = '0px'
    document.body.appendChild( this.stats.domElement )
    
    this.gui = new dat.GUI()
    this.gui.close()
    
    const general = this.gui.addFolder( 'General' )
    general.open()
    general
      .add( this, 'speed' )
      .min( 0.01 ).max( 0.2 ).step( 0.01 )
      .name( 'Speed' )
    general
      .add( this, 'intensity' )
      .min( 0.1 ).max( 1.5 ).step( 0.01 )
      .name( 'Intensity' )
      .onChange( (value) => this.uniforms.intensity.value = value )
    general
      .add( this, 'wildGlitch' )
      .name( 'Wild Glitch' )
      .onChange( (value) => this.glitch.goWild = value )
    general
      .add( this, 'mousePosition' )
      .name( 'Mouse Position' )
      .onChange( (value) => this.uniforms.mousePosition.value = value )
    general
      .addColor( this, 'color' )
      .name( 'Color' )
      .onChange( (value) => this.uniforms.color.value = new THREE.Vector3( ...this.rgbToPercentage(value) ) )
    
    const offset = this.gui.addFolder( 'Offset' )
    offset
      .add( this.offset, 'x', 1, 10, 0.1 )
      .name( 'X Axis Offset' )
      .onChange( (value) => this.uniforms.offsetX.value = value )
     offset
      .add( this.offset, 'y', 1, 10, 0.1 )
      .name( 'Y Axis Offset' )
      .onChange( (value) => this.uniforms.offsetY.value = value )

    this.createMesh()
    this.animate()
  }
  
  rgbToPercentage(arr) {
    return arr.map( (value) => value / 255 )
  }
  
  randomInt(min, max) {
    return (Math.random() * (max - min + 1) ) << 0
  }
  
  easeOutQuad(t) {
    return t * ( 2 -t )
  }

  onMouseMove(event) {
    event.preventDefault()

    this.mouse.x = this.easeOutQuad( ( event.clientX - this.renderer.domElement.width / 2 ) / this.renderer.domElement.width )
    this.mouse.y =  this.easeOutQuad(- ( event.clientY - this.renderer.domElement.height / 2 ) / this.renderer.domElement.height )
  }
  
  createMesh() {
    
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      mouse: {
        type: 'v2',
        value: new THREE.Vector2( this.mouse.x, this.mouse.y )
      },
      resolution: {
        type: 'v2',
        value: new THREE.Vector2( this.innerWidth, this.innerHeight )
      },
      intensity: {
        type: 'f',
        value: this.intensity
      },
      mousePosition: {
        type: 'i',
        value: this.mousePosition
      },
      color: {
        type: 'v3',
        value: new THREE.Vector3( ...this.rgbToPercentage( this.color ) )
      },
      offsetX: {
        type: 'f',
        value: this.offset.x
      },
      offsetY: {
        type: 'f',
        value: this.offset.y
      }
    }
    
    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      fragmentShader: document.getElementById( 'fragment_shader' ).textContent
    })

    const geometry = new THREE.PlaneGeometry( this.innerWidth, this.innerHeight, 1 )
    const mesh     = new THREE.Mesh( geometry, material )

    this.scene.add( mesh )
  }

  resize() {
    this.innerWidth = window.innerWidth
    this.innerHeight = window.innerHeight

    this.camera.aspect = this.innerWidth / this.innerHeight
    this.camera.updateProjectionMatrix()
    
    this.uniforms.resolution.value.x = this.innerWidth
    this.uniforms.resolution.value.y = this.innerHeight
    
    this.composer.setSize( this.innerWidth, this.innerHeight )
    this.renderer.setSize( this.innerWidth, this.innerHeight )
  }
  
  animate() {
    this.uniforms.time.value        += this.speed
    this.uniforms.mouse.value.x      = this.mouse.x
    this.uniforms.mouse.value.y      = this.mouse.y

    this.stats.update()
    
    this.render()
  }

  render() {
    window.requestAnimationFrame( ::this.animate )
    this.composer.render()
  }
}

let the = ( new Magic() ).begin()