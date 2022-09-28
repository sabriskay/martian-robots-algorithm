const fs = require('fs');

const HALF_PI = Math.PI/2;

const ORIENTATION_TO_ANGLE = {
    E: 0,
    N: HALF_PI,
    W: HALF_PI * 2,
    S: HALF_PI * 3
}

const ANGLE_TO_ORIENTATION = {
    '0.00' : 'E',
    [`${HALF_PI.toFixed(2)}`] : 'N',
    [`${(HALF_PI * 2).toFixed(2)}`] : 'W',
    [`${(HALF_PI * 3).toFixed(2)}`] : 'S',
}

function getOrientationFromAngle (angle) {
   
    angle = angle % (Math.PI * 2)
   
    if (angle < 0) {
        angle += Math.PI * 2
    }

    return ANGLE_TO_ORIENTATION[angle.toFixed(2)];
}

fs.readFile('./instructions.txt', (err, data) => {
    if (err) {
        throw err;
    }

    data = data.toString().split('\r\n');

    const [ GRID_SIZE_X, GRID_SIZE_Y ] = data[0].split(' ').map(Number);
    const positionLost = {}  

    for (let i = 1; i < data.length; i+=2) {
        const initialValues = data[i].split(' ');
        const orientation = initialValues[2];
        const instructions = data[i+1];
        let posX = parseInt(initialValues[0]);
        let posY = parseInt(initialValues[1]);

        let angle = ORIENTATION_TO_ANGLE[orientation];
        let Robotlosted = false;

        for (let j = 0; j < instructions.length; j++) {
            
            if (!Robotlosted) {

                switch (instructions[j]) {
                    case 'F':
        
                        let _posX = posX + Math.round(Math.cos(angle));
                        let _posY = posY + Math.round(Math.sin(angle));
        
                        if (_posX > GRID_SIZE_X || _posY > GRID_SIZE_Y) {
                            const hasRobotFallenBefore = !!positionLost[`${_posX} ${_posY}`] && positionLost[`${_posX} ${_posY}`] == true;

        
                            if (hasRobotFallenBefore) {
                                continue;
                            } else {
                                positionLost[`${_posX} ${_posY}`] = true;

                                Robotlosted = true;

                                console.log( `${posX} ${posY} ${getOrientationFromAngle(angle)} LOST`);
                                break; 
                            }
                        }
        
                        posX = _posX;
                        posY = _posY;
                        break;
        
                    case 'R': 
                        angle -= HALF_PI;  
                        break;
        
                    case 'L':
                        angle += HALF_PI;         
                        break;
        
                }

            }

        }

        if (Robotlosted) {
            continue;
        }
        else {
            console.log(`${posX} ${posY} ${getOrientationFromAngle(angle)}`);
        }
        
    }

})