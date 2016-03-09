(function () {

    var hotdog = function (specifications) {
        SpriteLibrary.hotdog(specifications);
    };

    var tardis = function (specifications) {
        SpriteLibrary.tardis(specifications);
    };

    var bb8 = function (specifications) {
        SpriteLibrary.bb8(specifications);
    };

    var background = function (specifications) {
        var renderingContext = specifications.renderingContext;

        renderingContext.save();
        renderingContext.fillStyle = "#5FB1EA";
        renderingContext.fillRect(0,0,1023, 767);
        renderingContext.restore();

        renderingContext.save();
        renderingContext.fillStyle = "#00D204";
        renderingContext.fillRect(0,576,1023,191);
        renderingContext.restore();
    };


    var sprites = [
        {
            draw: background,
            keyframes: [
                {
                    frame: 0,
                    tx: 0,
                    ty: 0,
                    sx: 1,
                    sy: 1
                },
                {
                    frame: 300,
                    tx: 0,
                    ty: 0,
                    sx: 1,
                    sy: 1
                }
            ]
        },
        {
            draw: tardis,
            keyframes: [
                {
                    frame: 20,
                    tx: 300,
                    ty: 250,
                    a: 0.0000001,
                    sx: 1.8,
                    sy: 1.8,
                    parameters: [
                        {
                            name: "decimalDoorOpen",
                            value: 0
                        }
                    ],
                    ease: KeyframeTweener.outBounce
                },
                {
                    frame: 70,
                    tx: 300,
                    ty: 250,
                    a: 1,
                    sx: 2,
                    sy: 2,
                    parameters: [
                        {
                            name: "decimalDoorOpen",
                            value: 0
                        }
                    ],
                    ease: KeyframeTweener.quadEaseIn
                },
                {
                    frame: 90,
                    tx: 300,
                    ty: 250,
                    sx: 2,
                    sy: 2,
                    parameters: [
                        {
                            name: "decimalDoorOpen",
                            value: 1
                        }
                    ]
                },
                {
                    frame: 200,
                    tx: 300,
                    ty: 250,
                    sx: 2,
                    sy: 2,
                    parameters: [
                        {
                            name: "decimalDoorOpen",
                            value: 1
                        }
                    ]
                }
            ]
        },
        {
            draw: bb8,
            keyframes: [
                {
                    frame: 100,
                    tx: 300,
                    ty: 450,
                    a: 0.7,
                    sx: 0.3,
                    sy: 0.3,
                    parameters: [
                        {
                            name: "headRotation",
                            value: -.01 * Math.PI
                        },
                        {
                            name: "bodyRotation",
                            value: 0
                        }
                    ],
                    ease: KeyframeTweener.quadEaseIn
                },
                {
                    frame: 115,
                    tx: 300,
                    ty: 480,
                    a: 1,
                    sx: 0.83,
                    sy: 0.83,
                    parameters: [
                        {
                            name: "headRotation",
                            value: -.01001 * Math.PI
                        },
                        {
                            name: "bodyRotation",
                            value: 0
                        }
                    ],
                    ease: KeyframeTweener.outBounce
                },
                {
                    frame: 150,
                    tx: 300,
                    ty: 570,
                    parameters: [
                        {
                            name: "headRotation",
                            value: .01 * Math.PI
                        },
                        {
                            name: "bodyRotation",
                            value: 0
                        }
                    ],
                    ease: KeyframeTweener.quadEaseIn
                },
                {
                    frame: 170,
                    tx: 300,
                    ty: 570,
                    parameters: [
                        {
                            name: "headRotation",
                            value: -.3 * Math.PI
                        },
                        {
                            name: "bodyRotation",
                            value: 0
                        }
                    ],
                    ease: KeyframeTweener.inOutBack
                },
                {
                    frame: 250,
                    tx: 800,
                    ty: 570,
                    parameters: [
                        {
                            name: "headRotation",
                            value: .3 * Math.PI
                        },
                        {
                            name: "bodyRotation",
                            value: 20
                        }
                    ],
                    ease: KeyframeTweener.inOutBack
                },
                {
                    frame: 280,
                    tx: 800,
                    ty: 570,
                    parameters: [
                        {
                            name: "headRotation",
                            value: 0
                        },
                        {
                            name: "bodyRotation",
                            value: 20
                        }
                    ],
                    ease: KeyframeTweener.quadEaseOut
                }
            ]
        },
        {
            draw: hotdog,
            keyframes: [
                {
                    frame: 0,
                    tx: 20,
                    ty: 20,
                    parameters: [
                        {
                            name: "headRotation",
                            value: 0
                        },
                        {
                            name: "tailRotation",
                            value: 0
                        },
                        {
                            name: "leftLegsRotation",
                            value: 0
                        },
                        {
                            name: "rightLegsRotation",
                            value: 0
                        }
                    ],
                    ease: KeyframeTweener.quadEaseInOut
                },

                {
                    frame: 30,
                    tx: 100,
                    ty: 50,
                    parameters: [
                        {
                            name: "headRotation",
                            value: 5
                        },
                        {
                            name: "tailRotation",
                            value: 10
                        },
                        {
                            name: "leftLegsRotation",
                            value: 20
                        },
                        {
                            name: "rightLegsRotation",
                            value: 8
                        }
                    ],
                    ease: KeyframeTweener.quadEaseInOut
                },

                // The last keyframe does not need an easing function.
                {
                    frame: 80,
                    tx: 80,
                    ty: 500,
                    parameters: [
                        {
                            name: "headRotation",
                            value: 0
                        },
                        {
                            name: "tailRotation",
                            value: 5
                        },
                        {
                            name: "leftLegsRotation",
                            value: 3
                        },
                        {
                            name: "rightLegsRotation",
                            value: 0
                        }
                    ],
                    rotate: 60 // Keyframe.rotate uses degrees.
                }
            ]
        }
    ];

    var canvas = document.getElementById("canvas");
    KeyframeTweener.initialize({
        renderingContext: canvas.getContext("2d"),
        width: canvas.width,
        height: canvas.height,
        sprites: sprites
    });
}());