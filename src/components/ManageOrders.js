import React, {Component} from 'react';
import { Card, Button, Popup } from 'semantic-ui-react';
class ManageOrders extends Component{
  constructor(){
    super()
    this.state={
      allOrderLists: [],
      formattedOrderLists: [],
      buttonDisable: false,
      orderListIds: [],
      toggleLiveUpdate: false,
      liveUpdateText: 'Off',
      toggleInterval: '',
      customerNames: [],
      customerPhones: [],
      specialInstructions: [],
      totalPrices: [],
      orderTimes: [],
      disableButton: false
    }
  }
  componentDidMount(){
    fetch('https://backend-metro-pizza.herokuapp.com/api/v1/orders')
    .then(resp => resp.json())
    .then(json=>{
      const tempOrder = [];
      const tempId = [];
      const tempName = [];
      const tempPhone = [];
      const tempTime =[];
      const tempInstruction = [];
      const tempPrice =[]
      this.setState({allOrderLists: json})
      this.state.allOrderLists.reverse()
      this.state.allOrderLists.map((order, index)=>{
          tempOrder.push(order.order_lists.toString().replace(/=>/g, ": ").replace(/{/g, "").replace(/}/g, "").replace(/,/g, " || ").replace(/"/g, ""));
         tempId.push(json[index].id);
         tempName.push(this.state.allOrderLists[index].Customer_Name);
         tempPhone.push(this.state.allOrderLists[index].Customer_Phone);
         tempTime.push(this.state.allOrderLists[index].Order_Time);
         tempInstruction.push(this.state.allOrderLists[index].Special_Instruction);
         tempPrice.push(this.state.allOrderLists[index].Total_Price);
         return null;
      })
      this.setState({
        formattedOrderLists: tempOrder,
        orderListIds: tempId,
        customerNames: tempName,
        customerPhones: tempPhone,
        orderTimes: tempTime,
        specialInstructions: tempInstruction,
        totalPrices: tempPrice
       })
    })
    this.handleLiveUpdate()
  }

  componentWillUnmount(){
    clearInterval(this.state.toggleInterval)
  }

  handleUpdateOrderList = ()=>{
    fetch('https://backend-metro-pizza.herokuapp.com/api/v1/orders')
    .then(resp => resp.json())
    .then(json=>{
      const tempOrder = [];
      const tempId = [];
      const tempName = [];
      const tempPhone = [];
      const tempTime =[];
      const tempInstruction = [];
      const tempPrice =[]
      this.setState({allOrderLists: json})
      this.state.allOrderLists.reverse()
      this.state.allOrderLists.map((order, index)=>{
          tempOrder.push(order.order_lists.toString().replace(/=>/g, ": ").replace(/{/g, "").replace(/}/g, "").replace(/,/g, " || ").replace(/"/g, ""));
         tempId.push(json[index].id);
         tempName.push(this.state.allOrderLists[index].Customer_Name);
         tempPhone.push(this.state.allOrderLists[index].Customer_Phone);
         tempTime.push(this.state.allOrderLists[index].Order_Time);
         tempInstruction.push(this.state.allOrderLists[index].Special_Instruction);
         tempPrice.push(this.state.allOrderLists[index].Total_Price);
         return null;
      })
      this.setState({
        formattedOrderLists: tempOrder,
        orderListIds: tempId,
        customerNames: tempName,
        customerPhones: tempPhone,
        orderTimes: tempTime,
        specialInstructions: tempInstruction,
        totalPrices: tempPrice
       })
    })
  }

  handleButtonDisable = (ev)=>{
    if(ev.target.value){
      ev.target.disabled = true
      ev.target.className = 'secondary ui  button'
    }

  }

  handleDeleteOrder = (ev)=>{
    const x = window.confirm("Are you sure you want to delete this?");
    if (x){
      fetch(`https://backend-metro-pizza.herokuapp.com/api/v1/orders/${ev.target.name}`,{
        method: 'DELETE'});
      setTimeout(this.handleUpdateOrderList, 2000);
      return true;
    }
    else {
      return false;
    }
  }

  handleLiveUpdate = (ev)=>{
    this.setState({ toggleLiveUpdate: !this.state.toggleLiveUpdate })
    if(this.state.toggleLiveUpdate){
      this.setState({liveUpdateText: 'Off'})
      clearInterval(this.state.toggleInterval)
    }
    else{
      this.setState({liveUpdateText: 'On', toggleInterval: setInterval(this.handleUpdateOrderList, 4000)})
    }
  }

  render(){
    return(
      <div id="order_div">
        <Popup content="Turn LiveUpdate off to stop receiving new orders" trigger={<Button toggle   active={this.state.toggleLiveUpdate} onClick={this.handleLiveUpdate}>
          Live Update {this.state.liveUpdateText}</Button>}/>
        <br/><br/>
        <Card.Group centered>
          {
            this.state.formattedOrderLists.map((order, index)=>{
              return <Card key={index} id='order_card'
                header=<div><strong>Customer Name: {this.state.customerNames[index]} || Phone: {this.state.customerPhones[index]} || Time: {this.state.orderTimes[index]}</strong><hr/></div>
                description=<div><strong>Items: - {order}</strong><hr/>Notes:<br/> {this.state.specialInstructions[index]}<br/><br/>Total Cost: ${this.state.totalPrices[index]}</div>
                extra=<Button.Group> <Button positive onClick={this.handleButtonDisable} value={index}>Mark Order</Button> <Button.Or />
                  <Button  onClick={this.handleDeleteOrder} name={this.state.orderListIds[index]}>Delete Order</Button>
                </Button.Group> /> })
          }
        </Card.Group>
      </div>
    )
  }
}

export default ManageOrders;
