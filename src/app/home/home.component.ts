import { EmployeeService } from './../services/employee.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RequestapprovalService } from '../services/requestapproval.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  username: string;
  constructor(
    private _authen: AuthService,
    private _route: Router,
    private route: ActivatedRoute,
    private reqService: RequestapprovalService,
    private employeeService : EmployeeService
    ) { }
    
  isCollapsed = false;
  isLoadingTwo= false;
  title = "";
 
  ngOnInit(): void {
    this.username=this._authen.getUserName();
    this.GetOnNoti();
    this.getBirthDayNoti();
    this.permisonNoti();
  }
  loadTwo(){
   this._authen.logOut()
     this._route.navigate([""]);
  }
  onActivate(componentReference) {
    this.title = componentReference.title;
  }
  listNoti:any;
  GetOnNoti(){
    this.reqService.getNotification().subscribe(res=>
      {
        this.listNoti=res;
        console.log("list noti",this.listNoti);
        this.countNoti();
      });
      
  }

  listBirthDayNoti:any;
  getBirthDayNoti(){
    this.employeeService.getBirthDay().subscribe(res=>{
      this.listBirthDayNoti = res;
      console.log("list birthday: ",this.listBirthDayNoti);
      this.countBirthDayNoti();
    })
  }

  count: number;
  countNoti(){
    this.count = this?.listNoti.length;
  }

  countBirthDay: number;
  countBirthDayNoti(){
    this.countBirthDay = this?.listBirthDayNoti.length;
    console.log("count birthday today: ",this.countBirthDay);
  }

  isRole : boolean = false;
  permisonNoti(){
    let item=JSON.parse(localStorage.getItem("CURRENTUSER"));
    console.log('item ============');
    console.log(item);
    console.log(item.roleId);
    this.isRole = item.roleId == 4;
  }
  isVisible = false;
  isOkLoading = false;

  showModal(): void {
    this.isVisible = true;
  }
  handleCancel(): void {
    this.isVisible = false;
  }


  //Modal BirthDay
  isShowBirthDay = false;
  showModalBirthDay(): void {
    this.isShowBirthDay = true;
  }
  handleBirthDayCancel(): void {
    this.isShowBirthDay = false;
  }

}
