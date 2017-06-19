import React, { Component } from 'react';
import { TouchableOpacity,ActivityIndicator, Dimensions,ListView, Text, View } from 'react-native';
import AgendaPage from './AgendaPage';
import _ from 'lodash';

import EvilIcon from 'react-native-vector-icons/EvilIcons'
import Calendar from 'react-native-calendar-select';

let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

  // dataSource: ds.cloneWithRows(responseJson),
let {height, width} = Dimensions.get('window');
import moment from 'moment';
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      minDate:moment().format("YYYY-MM-DD"),
      maxDate:moment().add(3,"months").format("YYYY-MM-DD"),
      startDate:moment().format("YYYY-MM-DD"),
      endDate:moment().add(3,"months").format("YYYY-MM-DD"),
      // .add('days', 30)
    }
    this.formatEvents=this.formatEvents.bind(this)
    this.openCalendar = this.openCalendar.bind(this);
    this.confirmDate = this.confirmDate.bind(this);
    this.fetchEvents = this.fetchEvents.bind(this);
  }
  confirmDate({startDate, endDate, startMoment, endMoment}) {
   this.setState({
     startDate,
     endDate
   });
 }
 openCalendar() {
   this.calendar && this.calendar.open();
 }
formatEvents(events){
  let formattedEvents={}
  if(_.isArray(events))events.map((event) => {
    formattedEvents[moment(event.start).format('YYYY-MM-DD')]=[{title: event.title,start:event.start,url:event.url,first_start_time:event.first_start_time}]
  })
  // return formattedEvents
  this.setState({isLoading: false,events:formattedEvents})
}
fetchEvents(){
  const {startDate,endDate} = this.state
  // console.warn(`http://alttix.ksehq.com/api/Calendar?venueId=9&start=${startDate}&end=${endDate}`);
  return fetch(`http://alttix.ksehq.com/api/Calendar?venueId=9&start=${startDate}&end=${endDate}`)
  // return fetch('http://facebook.github.io/react-native/movies.json')
    .then((response) => response.json())
    .then((events) => {this.formatEvents(events)})
    .catch((error) => {console.error(error);});
}
  componentDidMount() {
      const {startDate,endDate} = this.state
    console.warn(`http://alttix.ksehq.com/api/Calendar?venueId=9&start=${startDate}&end=${endDate}`);

return this.fetchEvents()
  }

  render() {

    let customI18n = {
   'w': ['', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
   'weekday': ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
   'text': {
     'start': 'Today\'s',
     'end': 'Future',
     'date': 'Date',
     'save': 'Confirm',
     'clear': 'Reset'
   },
   //'date':"MM-DD-YYYY"
    'date': "ddd, MMM Do YYYY"  // date format
 };
 // optional property, too.
 let color = {
   subColor: '#f0f0f0',
 };
 //   return (<MapView />)
 let {startDate,endDate,minDate,maxDate} =this.state


    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, paddingTop: 20}}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={{flex: 1, paddingTop: 20}}>
        <TouchableOpacity onPress={this.openCalendar}
          style={{position:"absolute",top:25,left:10,flex:1,zIndex:3,width:35,height:35,alignItems:"center",justifyContent:"center",backgroundColor:"transparent"}}>
          <EvilIcon name={"calendar"} size={35} color="rgba(0,0,0,0.8)"/>
        </TouchableOpacity>
        <AgendaPage events={this.state.events}/>
        <Calendar
         i18n="en"
         ref={(calendar) => {this.calendar = calendar;}}
         customI18n={customI18n}
         color={color}
         format="MM-DD-YYYY"
         //format="YYYYMMDD"
         minDate={minDate?minDate:null}
         maxDate={maxDate?maxDate:null}
         startDate={startDate?startDate:null}
         endDate={endDate?endDate:null}
         onConfirm={this.confirmDate}
       />
        </View>
    );
  }
}
