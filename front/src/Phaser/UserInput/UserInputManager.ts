import { CursorKey, IVirtualJoystick } from "../../types";
import {GameScene} from "../Game/GameScene";
const {
  default: VirtualJoystick,
} = require("phaser3-rex-plugins/plugins/virtualjoystick.js");

interface UserInputManagerDatum {
    keyInstance: Phaser.Input.Keyboard.Key | CursorKey;
    event: UserInputEvent
}

export enum UserInputEvent {
    MoveLeft = 1,
    MoveUp,
    MoveRight,
    MoveDown,
    SpeedUp,
    Interact,
    Shout,
}

//we cannot use a map structure so we have to create a replacment
export class ActiveEventList {
    private eventMap : Map<UserInputEvent, boolean> = new Map<UserInputEvent, boolean>();

    get(event: UserInputEvent): boolean {
        return this.eventMap.get(event) || false;
    }
    set(event: UserInputEvent, value: boolean): void {
        this.eventMap.set(event, value);
    }
}

//this class is responsible for catching user inputs and listing all active user actions at every game tick events.
export class UserInputManager {
    private KeysCode!: UserInputManagerDatum[];
    private Scene: GameScene;
    private joystick : IVirtualJoystick;

    constructor(Scene: GameScene, virtualJoystick: IVirtualJoystick) {
        this.Scene = Scene;
        this.joystick = virtualJoystick;
        this.initKeyBoardEvent();
    }

    initKeyBoardEvent(){
        const joystickKeys = this.joystick.createCursorKeys();
        this.KeysCode = [
            {event: UserInputEvent.MoveUp, keyInstance: this.Scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z, false) },
            {event: UserInputEvent.MoveUp, keyInstance: this.Scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W, false) },
            {event: UserInputEvent.MoveLeft, keyInstance: this.Scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q, false) },
            {event: UserInputEvent.MoveLeft, keyInstance: this.Scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A, false) },
            {event: UserInputEvent.MoveDown, keyInstance: this.Scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S, false) },
            {event: UserInputEvent.MoveRight, keyInstance: this.Scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D, false) },

            {event: UserInputEvent.MoveUp, keyInstance: this.Scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP, false) },
            {event: UserInputEvent.MoveLeft, keyInstance: this.Scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT, false) },
            {event: UserInputEvent.MoveDown, keyInstance: this.Scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN, false) },
            {event: UserInputEvent.MoveRight, keyInstance: this.Scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT, false) },

            {event: UserInputEvent.SpeedUp, keyInstance: this.Scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT, false) },

            {event: UserInputEvent.Interact, keyInstance: this.Scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E, false) },
            {event: UserInputEvent.Interact, keyInstance: this.Scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE, false) },
            {event: UserInputEvent.Shout, keyInstance: this.Scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F, false) },

            {event: UserInputEvent.MoveUp, keyInstance: joystickKeys.up },
            {event: UserInputEvent.MoveLeft, keyInstance: joystickKeys.left },
            {event: UserInputEvent.MoveDown, keyInstance: joystickKeys.down },
            {event: UserInputEvent.MoveRight, keyInstance: joystickKeys.right },
        ];
    }

    clearAllListeners(){
        this.Scene.input.keyboard.removeAllListeners();
    }

    clearAllKeys(){
        this.Scene.input.keyboard.removeAllKeys();
    }

    getEventListForGameTick(): ActiveEventList {
        const eventsMap = new ActiveEventList();
        this.KeysCode.forEach(d => {
            if (d.keyInstance.isDown) {
                eventsMap.set(d.event, true);
            }
        });
        return eventsMap;
    }

    spaceEvent(callback : Function){
        this.Scene.input.keyboard.on('keyup-SPACE', (event: Event) => {
            callback();
            return event;
        });
    }

    addSpaceEventListner(callback : Function){
        this.Scene.input.keyboard.addListener('keyup-SPACE', callback);
    }
    removeSpaceEventListner(callback : Function){
        this.Scene.input.keyboard.removeListener('keyup-SPACE', callback);
    }
}
