import React, { Component } from 'react';
import findIndex from 'lodash/findIndex';
import last from 'lodash/last';
import slice from 'lodash/slice';
import random from 'lodash/random';
import reverse from 'lodash/reverse';

const num = 16;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [{
        x: 0,
        y: 0
      }, {
        x: 0,
        y: 1
      }],
      gameOver: false,
      rand: {x: 5, y: 6},
      type: 3// 0 上, 1 左, 2 下, 3 右
    };
    this.init();
  }

  init = () => {
    this.timer = setInterval(() => {
      this.snake();
    }, 100);
  }

  clear = () => {
    clearInterval(this.timer);
    this.snake();
    this.init();
  }

  snake = () => {
    const { data, type, rand, gameOver } = this.state;
    let newItem = {};
    let lastItem = last(data);
    switch (type) {
      case 0:
        newItem = {x: lastItem.x - 1, y: lastItem.y};
        break;
      case 1:
        newItem = {x: lastItem.x, y: lastItem.y - 1};
        break;
      case 2:
        newItem = {x: lastItem.x + 1, y: lastItem.y};
        break;
      case 3:
        newItem = {x: lastItem.x, y: lastItem.y + 1};
        break;
    }
    if (!gameOver) {
      if (newItem.x < 0 || newItem.x === num || newItem.y < 0 || newItem.y === num) {
        alert('游戏结束');
        clearInterval(this.timer);
        this.setState({gameOver: true});
      } else {
        const index = findIndex(data, newItem);
        if (index !== -1) {
          alert('游戏结束');
          clearInterval(this.timer);
          this.setState({gameOver: true});
        } else {
          let newData = [];
          if (rand.x === newItem.x && rand.y === newItem.y) {
            newData = [...data];
            this.rangeItem();
          } else {
            newData = slice(data, 1);
          }
          newData = [...newData, newItem];
          this.setState({data: newData});
        }
      }
    }
  }

  rangeItem = () => {
    const { data } = this.state;
    const x = random(num - 1);
    const y = random(num - 1);
    const index = findIndex(data, {x, y});
    if (index === -1) {
      this.setState({rand: {x, y}});
    } else {
      this.rangeItem();
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', (e) => {
      const { gameOver, data } = this.state;
      const [ lastTwo, lastOne,...rest ] = reverse([...data]);
      if (!gameOver) {
        switch (e.keyCode) {
          case 37: // 往左运动
            if (!(lastTwo.y - lastOne.y === 1 && lastTwo.x - lastOne.x === 0)) { // 此时运动方向不能是往右
              this.setState({type: 1}, () => this.clear());
            }
            break;
          case 38: // 往上运动
            if (!(lastTwo.x - lastOne.x === 1 && lastTwo.y - lastOne.y === 0)) { // 此时运动方向不能是往下
              this.setState({type: 0}, () => this.clear());
            }
            break;
          case 39: // 往右运动
            if (!(lastTwo.y - lastOne.y === -1 &&  lastTwo.x - lastOne.x === 0)) { // 此时运动方向不能是往左
              this.setState({type: 3}, () => this.clear());
            }
            break;
          case 40: // 往下运动
            if (!(lastTwo.x - lastOne.x === -1 && lastTwo.y - lastOne.y === 0)) { // 此时运动方向不能是往上
              this.setState({type: 2}, () => this.clear());
            }
            break;
          default: ;
        }
      }
    });
  }

  getItem = () => {
    const { data, rand } = this.state;
    let str = "";
    for (let x = 0; x < num; x++) {
      str += "<div class='row'>";
      for (let y = 0; y < num; y++) {
        if (rand.x === x && rand.y === y) {
          str += "<div class='item rand'></div>";
        } else {
          let index = findIndex(data, {x, y});
          if (index >= 0) {
            str += "<div class='item snake'></div>";
          } else {
            str += "<div class='item'></div>";
          }
        }
      }
      str += "</div>";
    }
    return str;
  }

  render() {
    return (
      <div className='list' dangerouslySetInnerHTML={{ __html: this.getItem() }}/>
    )
  }
}

export default App;