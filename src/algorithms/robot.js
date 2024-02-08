
const SPEED_UP_FACTOR = 16
const ROBOT_WIDTH = 2.5
const ROBOT_LENGTH = 4
const HEAD_WIDTH = .5
const VISION_DISTANCE = 30

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

    move(dist){
        console.log(this.x)
        this.x += dist * Math.cos(this.theta)
        this.y += dist * Math.sin(this.theta)
    }
    setpos(val){
        this.x = val[0]
        this.y = val[1]
    }

}



export {robot}
