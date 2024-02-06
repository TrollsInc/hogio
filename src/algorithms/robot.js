
const SPEED_UP_FACTOR = 16
const ROBOT_WIDTH = 25
const ROBOT_LENGTH = 40
const HEAD_WIDTH = 5
const VISION_DISTANCE = 30.0

class robot {
    ROBOT_CORNERS = [
            [ROBOT_LENGTH / 2 - HEAD_WIDTH, ROBOT_WIDTH / 2, 1],
            [ROBOT_LENGTH / 2 - HEAD_WIDTH, -ROBOT_WIDTH / 2, 1],
            [-ROBOT_LENGTH / 2, -ROBOT_WIDTH / 2, 1],
            [-ROBOT_LENGTH / 2, ROBOT_WIDTH / 2, 1]]
    ROBOT_HEAD_CORNERS =
        [
            [ROBOT_LENGTH / 2, ROBOT_WIDTH / 2, 1],
            [ROBOT_LENGTH / 2, -ROBOT_WIDTH / 2, 1],
            [ROBOT_LENGTH / 2 - HEAD_WIDTH, -ROBOT_WIDTH / 2, 1],
            [ROBOT_LENGTH / 2 - HEAD_WIDTH, ROBOT_WIDTH / 2, 1]
        ]

    constructor(x,y,map) {
        this.x = x
        this.y =y
        this.theta = 0
        this.map = map
        this.trajectory = [[this.x, this.y]]
    }
    getX() {
        return this.x
    }
    getY() {
        return this.y
    }
    getTheta() {
        return this.theta
    }

    get_transform_matrix(x, y, theta){
        return         [
            [Math.cos(theta), -Math.sin(theta), x],
            [Math.sin(theta), Math.cos(theta), y],
            [0, 0, 1]
        ]
    }

    turn_in_place(self, angle_rad){
        let TIME_TO_ROTATE = 0.5 / SPEED_UP_FACTOR
        let ANGLE_PER_FRAME = angle_rad / Math.ceil(TIME_TO_ROTATE * 60)
        for(let i = 0; i< Math.ceil(TIME_TO_ROTATE*60); i++){
            this.theta += ANGLE_PER_FRAME
            sleep(1/60)
        }
    }

    move_forward(distance_mm, mm_per_sec){
        if(distance_mm<0 ){
            distance_mm = 0
        }
        if(distance_mm>30){
            distance_mm = 30
        }
        let TIME_TO_MOVE = distance_mm / mm_per_sec / SPEED_UP_FACTOR
        let DISTANCE_PER_FRAME = distance_mm / Math.ceil(TIME_TO_MOVE * 60)
        for (let i =0; i<Math.ceil(TIME_TO_MOVE * 60); i++){
            this.x += DISTANCE_PER_FRAME * Math.cos(this.theta)
            this.y += DISTANCE_PER_FRAME * Math.sin(this.theta)
            this.trajectory.push([this.x, this.y])
        }
    }
    move(dist){
        console.log(this.x)
        this.x += dist * Math.cos(this.theta)
        this.y += dist * Math.sin(this.theta)
    }

}



let sleepSetTimeout_ctrl;
function sleep(ms) {
    clearInterval(sleepSetTimeout_ctrl);
    return new Promise(resolve => sleepSetTimeout_ctrl = setTimeout(resolve, ms));
}

export {robot}
