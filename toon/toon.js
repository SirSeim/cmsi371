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


    var sprites = [
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
                    ease: KeyframeTweener.linear
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
        },
        {
            draw: bb8,
            keyframes: [
                {
                    frame: 0,
                    tx: 150,
                    ty: 50,
                    parameters: [
                        {
                            name: "headRotation",
                            value: -.1 * Math.PI
                        },
                        {
                            name: "bodyRotation",
                            value: 0
                        }
                    ],
                    ease: KeyframeTweener.quadEaseIn
                },
                {
                    frame: 20,
                    tx: 150,
                    ty: 50,
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
                    frame: 120,
                    tx: 550,
                    ty: 50,
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