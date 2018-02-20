import { tween, styler, action, spring, value, composite, physics, easing, pointer, listen, transform } from 'popmotion';

window.addEventListener("load", function() {
  const counter = document.querySelector('.counter');
  const updateCounter = (v) => counter.innerHTML = v;

  tween({ to: 300, duration: 500 }).start(updateCounter);

  const just = (v) => action(({ update, complete }) => {
    update(v);
    complete();
  });

  just(1).start({
    update: console.log,
    complete: () => console.log('complete!')
  });


  const polarToCartesian = ({ angle, radiusA, radiusB }) => ({
    x: radiusA * Math.cos(angle),
    y: radiusB * Math.sin(angle),
    angle: angle
  });

  const velocityLimiter = (v) => {
    let velXY = satXY.getVelocity();
    let angularSpeed = velXY.angle;
    console.log(velXY);
    if (angularSpeed >= 3.0) {
      orbitTest.setAcceleration({angle: 0.0});
    }
    /*
    let velX = velXY.x;
    let velY = velXY.y;
    let vel = Math.sqrt(velX * velX + velY * velY);
    let maxVel = 1000;
    if (vel < maxVel) {
      //orbitTest.setAcceleration({angle: 0.2});
      //orbitTest.setVelocity({angle: vel});
    } else {
      //orbitTest.setAcceleration({angle: 0});
      //orbitTest.setVelocity({angle: maxVel});
      console.log(vel, maxVel);
    }
    */
    //console.log(vel);
    return v;
  };



  /*
  const polarToCartesian = ({ angle, radius }) => ({
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle)
  });
*/

  const sat = document.querySelector('#sat');
  const satStyler = styler(sat);

  const satXY = value({x: 0, y: 0}, satStyler.set);
  const satPolar = value({angle: 0, radiusA: 0, radiusB: 0}, console.log);
  /*
  const startTracking = () => {
    pointer(satXY.get()).start(satXY);
  };

  const stopTracking = () => {
    const velocity = satXY.getVelocity();
  };
  */


  const orbitTest = composite({
    angle: physics({
      velocity: 0,
      acceleration: 0.2
    }),
    /*
    radius: tween({
      from: 0,
      to: 150,
      yoyo: Infinity,
      ease: easing.easeInOut,
      duration: 2000
    })
    */
    radiusA: physics({
      from: 300,
      to: 300
    }),
    radiusB: physics({
      from: 300,
      to: 300
    }),

  })
  .pipe(velocityLimiter)
  .pipe(polarToCartesian)
  //.start(satStyler.set);
  .start(satXY);
  //.start(satPolar);


  /*
  physics({ velocity: 30 })
    .pipe(v => Math.min(100,v))
    .start(v => console.log("wrap", v))
*/
  /*
  physics({
    from: { angle: 0, radius: 150 },
    velocity: { angle: 5, radius: 0 }
  }).pipe(polarToCartesian)
    .start(satStyler.set);
    */
  /*
  const orbit = (v) => action(({init, update, complete}) => {

  });
  */
  /*
  const mySpring = spring({ to: 500 });

  mySpring.start({
    update: console.log,
    complete: () => console.log('complete!')
  });

  mySpring.start({
    update: (v) => console.log('second spring: ' + v),
    complete: () => console.log('second spring also complete!')
  });
  */
  /*
  const myValue = value(0, console.log);

  tween().start(myValue);

  setTimeout(() => myValue.getVelocity(), 100)
  */

  /*
  const xy = value({ x: 0, y: 0 }, console.log);
  const foo = tween({
    to: { x: 100, y: 200 }
  }).start(xy);

  setTimeout(() => xy.getVelocity(), 100); // Returns as object
  */
});
