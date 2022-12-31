import { Component, OnInit } from '@angular/core';
import {AccountusersService} from "../services/accountusers.service";
import {AccountUser} from "../models/AccountUser";
import {MatTableDataSource} from "@angular/material/table";
import {Device} from "../models/Device";
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import $ from 'jquery';


@Component({
  selector: 'app-user-page-devices',
  templateUrl: './user-page-devices.component.html',
  styleUrls: ['./user-page-devices.component.css']
})
export class UserPageDevicesComponent implements OnInit {
  public accountUser: AccountUser;
  displayedColumns: string[] = ['location', 'description', 'maximumconsumption'];
  public dataSource: MatTableDataSource<Device>;
  private serverUrl = 'http://localhost:8090/socket'
  private title = 'WebSockets chat';
  private stompClient: any;
  public messageShow: string;

  constructor(private usersService: AccountusersService,

              ) { }

  ngOnInit(): void {
    this.loadDevices();
    this.initializeWebSocketConnection();
  }

  loadDevices()
  {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.usersService.getUserById(user.id).subscribe((result)=>
    {
      this.accountUser=result;
      this.usersService.getDevices(user.id).subscribe((results)=>
      {
        this.dataSource=new MatTableDataSource(results);;
      })
    })
  }

  initializeWebSocketConnection(){
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, (frame: any) => {
      that.stompClient.subscribe("/chat", (message:any) => {
        if(message) {
          console.log(message);
          this.messageShow=message.body;
        }
      });
    });
  }

}
