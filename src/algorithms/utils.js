class Node{
    constructor(coord, parent) {
        this.coord = coord
        this.parent = parent
    }
    getX(){
        return this.coord[0]
    }
    getY(){
        return this.coord[1]
    }
    getParent(){
        return this.parent
    }
}

function getDist(p, q){
    return Math.sqrt((p.getX() - q.getX())^2 + (p.getY() - q.getY())^2)
}
function isZero(value){
    return Math.abs(value) < 1e-9
}
function onSegment(p, q, r){
    return q.getX() <= Math.max(p.getX(), r.getX()) && q.getX() >= Math.min(p.getX(), r.getX()) &&
        q.getY() <= Math.max(p.getY(), r.getY()) && q.getY() >= Math.min(p.getY(), r.getY());
}

function getOrientation(p,q,r) {
    let val = (q.getY() - p.getY()) * (r.getX() - q.getX()) - (q.getX() - p.getX()) * (r.getY() - q.getY())
    if (isZero(val)) {
        return 0
    } else if (val > 0) {
        return 1
    } else {
        return 2
    }
}

function intersects(p1, q1, p2, q2){
    let o1 = getOrientation(p1, q1, p2)
    let o2 = getOrientation(p1, q1, q2)
    let o3 = getOrientation(p2, q2, p1)
    let o4 = getOrientation(p2, q2, q1)

    if (o1 !== o2 && o3 !== o4){
        return true
    }
    if (isZero(o1) && onSegment(p1, p2, q1)){
        return true
    }
    if (isZero(o2) && onSegment(p1, q2, q1)){
        return true
    }
    if (isZero(o3) && onSegment(p2, p1, q2)){
        return true
    }
    if (isZero(o4) && onSegment(p2, q1, q2)){
        return true
    }
    return false
}

export {Node, getDist,isZero,onSegment,getOrientation,intersects}




