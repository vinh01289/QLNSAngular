import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RequestApprovalTypeEnum } from 'src/shared/constant';
import { RequestApproval } from '../modals/RequestApproval';
import { AuthService } from '../services/auth.service';
import { RequestapprovalService } from '../services/requestapproval.service';


@Component({
  selector: 'app-requestapproval',
  templateUrl: './requestapproval.component.html',
  styleUrls: ['./requestapproval.component.css']
})
export class RequestapprovalComponent implements OnInit {

  constructor(private fb: FormBuilder,private authen: AuthService,private reqService:RequestapprovalService) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      type: [null, [Validators.required]],
      time: [null, [Validators.required]],
      half: [false],
      typeoftime: [null,[this.validateIfChecked()]],
      reason: [null, [Validators.required]],
  
    });

    // if(this.authen.loginIn){
    //  const url=this.reqService.GetAll();
    //   console.log(url)
    // }
    // else{
    //   this.authen.logOut();
    // }
    this.getAll();
 
  }

  
  isRole : any;
  idRole: any;
  listEmTotal:any;  //Ds quyen Employee (chi Employee thay)
  listLeader:any;
  //listEm:any;
listAdmin: any; //Ds quyen admin (thay het)
  getAll(){
    let item=JSON.parse(localStorage.getItem("CURRENTUSER"));
   // let requesitem=JSON.parse(localStorage.getItem("RequestApproval"));
    this.idRole = item.roleId;
  this.reqService.getRequestapproval().subscribe(res=>{
    this.listAdmin =res;
    console.log("listAdmin",this.listAdmin);
    this.listEmTotal = this.listAdmin.filter(e=> e.employeeId == item.id);
    
  }) 
  
  }
 


  listOfAllData: RequestApproval[] = [];
  setType(type: any) {
    return RequestApprovalTypeEnum[type];
  }
  isHalf=false;
  
  validateIfChecked(): ValidatorFn {
    return (form: FormGroup): ValidationErrors | null => {
      var a= this.validateForm;
      if (a && a.controls['half'].value && !a.controls.typeoftime.value
        ) {
        return {
          'err': true
        };
      }
      return null;
    }
  }

  //button Create
  isVisible = false;
  showModal(): void {
    this.isVisible = true;
  }
  


  isEdit=false;
  editId=0;
  isConfirmLoading = false;
  handleOk(): void {
   for(const i in this.validateForm.controls){
     this.validateForm.controls[i].markAsDirty();
     this.validateForm.controls[i].updateValueAndValidity();
   }
   if(this.validateForm.valid){
     var entity=new RequestApproval();
     entity.type=this.validateForm.controls.type.value;
     entity.status=0;
     if(this.isHalf)
     entity.typeTimeOff=this.validateForm.controls.typeoftime.value;
     else entity.typeTimeOff='AllDay';
     entity.fromTime=this.validateForm.controls.time.value[0];
      entity.toTime=this.validateForm.controls.time.value[1];
      entity.reason=this.validateForm.controls.reason.value;
     entity.employeeId=JSON.parse(localStorage.getItem('CURRENTUSER')).id;
     console.warn(entity);  
     this.reqService.createRequestapproval(entity).subscribe(req=>{
      this.getAll();
     });
     
     this.isConfirmLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isConfirmLoading = false;
      
    }, 1000);
    
   }
   else this.isConfirmLoading=false;
  }
  typeList = RequestApprovalTypeEnum;
  validateForm: FormGroup;
  TypeChange(value) {
  }

  handleCancle(): void {
    this.validateForm.reset();
    this.isVisible = false;
    this.isEdit=false;
    
  }
  //Duyệt đơn xin nghỉ phép
  Accept(id){
    this.reqService.updateStatus(id).subscribe(e=>{
      console.log("DA UPDATE")
      this.getAll();
    })
  }
  DeleteRequestApproval(id){
    this.reqService.deleteRequestApproval(id).subscribe(e=>{console.log("da xoa")})
    window.location.reload();
  }
  
}
