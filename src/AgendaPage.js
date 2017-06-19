import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import {Agenda} from 'react-native-calendars';
import moment from 'moment';
import Icon from 'react-native-vector-icons/EvilIcons'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import RNCalendarEvents from 'react-native-calendar-events';

export default class AgendaScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {}
    };
    this.addEventToCalendar=this.addEventToCalendar.bind(this)
  }


  render() {
    const{events}=this.props
    console.warn(JSON.stringify(events));
    return (
      <Agenda
        items={events}
        loadItemsForMonth={this.loadItems.bind(this)}
        selected={moment().format('YYYY-MM-DD')}
        renderItem={this.renderItem.bind(this)}
        renderEmptyDate={this.renderEmptyDate.bind(this)}
        rowHasChanged={this.rowHasChanged.bind(this)}
        // monthFormat={'yyyy'}
        //theme={{calendarBackground: 'red'}}
        //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
      />
    );
  }

  loadItems(day) {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (!this.state.items[strTime]) {
          this.state.items[strTime] = [];
          const numItems = Math.floor(Math.random() * 5);
          for (let j = 0; j < numItems; j++) {
            this.state.items[strTime].push({
              name: 'Item for ' + strTime,
              height: Math.max(50, Math.floor(Math.random() * 150))
            });
          }
        }
      }
      //console.log(this.state.items);
      const newItems = {};
      Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
      this.setState({
        items: newItems
      });
    }, 1000);
    // console.log(`Load Items for ${day.year}-${day.month}`);
  }
addEventToCalendar(event){
  RNCalendarEvents.authorizationStatus()
  .then(status => {
    let time=moment(event.start).format("YYYY-MM-DDTHH:mm.ss.sss")+"Z"
console.warn(time);
    RNCalendarEvents.saveEvent(event.title, {
        location: '1000 Chopper Cir, Denver, CO 80204',
        notes: event.title,
        startDate: time,
        // endDate: '2017-08-19T19:26:00.000Z'
      })
      .then(id => {
        alert("event saved to calendar!")
        // handle success
      })
      .catch(error => {
        alert(error)
        // handle error
      });

  })
  .catch(error => {
   // handle error
  });
}
  renderItem(item) {
    return (
      <View style={[styles.item, {height: item.height}]}>
        <Text style={{color:"rgba(0,0,0,0.5)",fontSize: 15,fontWeight:"600",textAlign: "center",margin: 10,}}>{item.title}</Text>
        <Text style={{color:"rgba(0,0,0,0.5)",fontSize: 15,fontWeight:"600",textAlign: "center",margin: 10,}}>{moment(item.start).startOf("hour").fromNow()}</Text>
<TouchableOpacity onPress={()=>this.addEventToCalendar(item)}
        style={{
          //position:"absolute",top:25,right:10,flex:1,zIndex:3,
          width:35,height:35,alignItems:"center",justifyContent:"center",backgroundColor:"transparent"}}>
        <Icon name={"plus"} size={25} color="rgba(256,0,0,0.5)"/>
      </TouchableOpacity>

      </View>
    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}><Text>This is empty date!</Text></View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex:1,
    paddingTop: 30
  }
});
