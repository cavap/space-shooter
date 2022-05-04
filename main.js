let verticalShift = 25, verticalMin = 0, verticalMax = 525, horizontalMax = 340;
let isRunning = false;
let enemysCycle;

function moveShipUp(){
    let position = parseInt(getComputedStyle(document.querySelector('.ship')).getPropertyValue('top'));
    if(position >= verticalMin + verticalShift) document.querySelector('.ship').style.top = (position - verticalShift) + 'px';
}

function moveShipDown(){
    let position = parseInt(getComputedStyle(document.querySelector('.ship')).getPropertyValue('top'));
    if(position <= verticalMax - verticalShift) document.querySelector('.ship').style.top = (position + 25) + 'px';
}

function getShipPosition(){
    return parseInt(window.getComputedStyle(document.querySelector('.ship')).getPropertyValue('top'));
}

function createProjectile(){
    let projectile = document.createElement('img');
    projectile.src = 'images/shoot.png';
    projectile.classList.add('projectile');
    projectile.style.left = '20px';
    projectile.style.top = getShipPosition() + 'px';
    return projectile;
}

function checkProjectileCollision(projectile, enemy){
    let projectileTop = parseInt(projectile.style.top);
    let projectileLeft = parseInt(projectile.style.left);
    let enemyTop = parseInt(enemy.style.top);
    let enemyLeft = parseInt(enemy.style.left);
    let enemyBottom = enemyTop - 30;

    if(projectileLeft != horizontalMax && projectileLeft + 40 >= enemyLeft){
        if(projectileTop <= enemyTop && projectileTop >= enemyBottom){
            return true;
        }
        return false;
    }

    return false;
}

function moveProjectileRight(projectile){
    setInterval(() => {
        let x = parseInt(projectile.style.left);
        let enemys = document.querySelectorAll('.enemy');
        enemys.forEach((enemy) => {
            if(checkProjectileCollision(projectile, enemy)){
                enemy.src = 'images/explosion.png';
                enemy.classList.remove('enemy');
                enemy.classList.add('enemyDead');
            }
        })
        if(x === horizontalMax){
            projectile.remove();
        } else {
            projectile.style.left = (x + 8) + 'px';
        }
    }, 10);
}

function shoot(){
    let projectile = createProjectile();
    document.querySelector('#background').appendChild(projectile);
    moveProjectileRight(projectile);
}

function showElements(){
    document.querySelector('.buttonStart').style.display = 'block';
    document.querySelector('.info').style.display = 'block';
}

function hideElements(){
    document.querySelector('.buttonStart').style.display = 'none';
    document.querySelector('.info').style.display = 'none';
}

function gameOver(){
    isRunning = false;
    document.querySelector('.info').textContent = 'Game Over';
    clearInterval(enemysCycle);
    document.querySelectorAll('.enemy').forEach((enemy) => enemy.remove());
    document.querySelectorAll('.projectile').forEach((projectile) => projectile.remove());
    setTimeout(() => {
        document.querySelector('.ship').style.top = "250px";
        showElements();
    });
}

function moveEnemyLeft(enemy){
    setInterval(() => {
        let x = parseInt(window.getComputedStyle(enemy).getPropertyValue('left'));
        if(x <= 50){
            if(Array.from(enemy.classList).includes('enemyDead')){
                enemy.remove();
            } else {
                gameOver();
            }
        } else {
            enemy.style.left = (x - 4) + 'px';
        }
    }, 30);
}

function spawnEnemy(){
    let enemy = document.createElement('img');
    enemy.classList.add('enemy');
    enemy.classList.add('enemyTransition');
    enemy.style.left = '370px';
    enemy.style.top = (Math.floor(Math.random() * 330) + 30) + 'px';
    enemy.src = 'images/enemy' + (Math.floor(Math.random() * 3) + 1) + '.png';
    document.querySelector('#background').appendChild(enemy);
    moveEnemyLeft(enemy);
}

function startGame(){
    isRunning = true;
    hideElements();
    enemysCycle = setInterval(() => spawnEnemy(), 2000);
}

function handleKey(event){
    if(isRunning){
        if(event.key === "w" || event.key === 'ArrowUp') moveShipUp();
        if(event.key === "s" || event.key === 'ArrowDown') moveShipDown();
        if(event.key === " ") shoot();
    }
}

window.addEventListener('keydown', handleKey);
document.querySelector('.buttonStart').addEventListener('click', () => startGame());