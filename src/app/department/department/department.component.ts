import { AuthService } from './../../services/auth.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { EmployeeService } from './../../services/employee.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Employee } from 'src/app/modals/Employee';
import { DepartmentService } from 'src/app/services/department.service';

AuthService

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {

  idDepartment: number; //giá trị departmentId
  listEmployee : any; //Ds Employee
  listDepartment: any;  //Ds Department
  validateForm!: FormGroup; //Form tạo Employee
  validateFormEdit!: FormGroup; //Form sữa Employee
  searchText: any; //Search
  constructor(private eservice: EmployeeService, private dService: DepartmentService, 
    private fb: FormBuilder, 
    private notification: NzNotificationService,
    private nzMessageService: NzMessageService,
    private modal: NzModalService,
    private authService: AuthService){
   
  }
  
  ngOnInit(): void{
    this.getAllEmployee();
    this.getAllDepartment();
    let item=JSON.parse(localStorage.getItem("CURRENTUSER"));
    this.idDepartment = item.departmentId; 
    console.log("idDepartment",this.idDepartment);
   console.log(item);

   this.validateForm = this.fb.group({
        fullName: [null, [Validators.required]],
        email: [null, [Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
        dateOfBirth: [null, [Validators.required]],
        gender: [null, [Validators.required]],
        phoneNumber:[null,[Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{9}$")]],
        startDate:[null, [Validators.required]],
        department: [null, [Validators.required]],
        role:[null, [Validators.required]]
      })

    this.validateFormEdit = this.fb.group({
      fullName: [null, [Validators.required]],
      email: [null, [Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      dateOfBirth: [null, [Validators.required]],
      gender: ['Male', [Validators.required]],
      phoneNumber:[null,[Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{9}$")]],
      startDate:[null, [Validators.required]],
      department: [null, [Validators.required]],
      role:[null, [Validators.required]]
    })
  }
 
  listED:any; //Ds Employee theo Department 
  isRole: boolean = false; //Giá trị của roleId
  getAllEmployee(){
    let item=JSON.parse(localStorage.getItem("CURRENTUSER"));
    this.isRole = item.roleId == 1;
    this.eservice.getEmployees().subscribe(res=>{
      this.listEmployee=res;
      console.log("getAllEmployee res",res);
      console.log("getAllEmployee listEmployee",this.listEmployee);
    //  console.log('listEmployee', this.listEmployee);
      this.listED = this.listEmployee.filter(d => d.departmentId == this.idDepartment);
    //  console.log('arr1', this.arr1);
    })
  }

  

  getAllDepartment(){
    this.dService.getDepartment().subscribe(res=>{
      this.listDepartment = res;
      console.log("listDepartment",this.listDepartment);
    })
  }

  isShowCreate = false;
  showModalCreate(): void {
    this.isShowCreate = true;
  }


  handleOk(): void {
    console.log('Button ok clicked!');
    this.isShowCreate = false;

  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isShowCreate = false;
  }

  //button submit thêm nhân viên
  confirm(){
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid){
      let formSubmit = new Employee();
      formSubmit.fullName= this.validateForm.controls.fullName.value;
      formSubmit.email=this.validateForm.controls.email.value;
      formSubmit.dateOfBirth=this.validateForm.controls.dateOfBirth.value;
      formSubmit.gender=this.validateForm.controls.gender.value;
      formSubmit.phoneNumber=this.validateForm.controls.phoneNumber.value;
      formSubmit.startDate=this.validateForm.controls.startDate.value;
      formSubmit.departmentId=this.validateForm.controls.department.value;
      formSubmit.roleId=this.validateForm.controls.role.value;
      console.warn("formD",formSubmit);
      this.eservice.createEmployee(formSubmit).subscribe(res=>{
        this.notification.create('success', 'Success', 'Create Employee successfully');
        this.isShowCreate = false;
        this.validateForm.reset();
        this.getAllEmployee();
      } ,(error:any)=>{
        this.notification.create('error', 'failed', 'Create Employee failed');
      });     
   } 
  }

  //Button delete nhân viên
  showConfirm(employeeId): void {
    this.modal.confirm({
      nzTitle: '<i>Do you Want to delete Employee?</i>',
      nzContent: '' ,
      
      nzOnOk: () => {
        console.log('OK')
        this.eservice.deleteEmployee(employeeId).subscribe(res=>{
          this.notification.create('success', 'Success', 'Delete Employee successfully');
          this.getAllEmployee();
        },(error: any)=>{
          this.notification.create('error', 'failed', 'Delete Employee failed');
        })
      }
    });
    
  }

  //Hiển thị giá trị Edit lên Input
  isShowEdit = false;
  idEmployee:number;
  showModalEdit(id): void {
    this.isShowEdit = true;
    this.idEmployee=id;
    this.eservice.getEmployeesId(id).subscribe((data: any)=>{
      this.validateFormEdit.controls.fullName.setValue(data.fullName);
      this.validateFormEdit.controls.email.setValue(data.email);
      this.validateFormEdit.controls.dateOfBirth.setValue(data.dateOfBirth);
      this.validateFormEdit.controls.gender.setValue(data.gender);
      this.validateFormEdit.controls.phoneNumber.setValue(data.phoneNumber);
      this.validateFormEdit.controls.startDate.setValue(data.startDate);
      this.validateFormEdit.controls.department.setValue(data.departmentId);
      this.validateFormEdit.controls.role.setValue(data.roleId);
    })
  }

  handleOkMiddle(): void {
    this.submitEdit();
    console.log('click ok');
    //this.isShowEdit = false;
  }

  handleCancelMiddle(): void {
    this.isShowEdit = false;
  }

  //Button submit Edit
  submitEdit(){
    for (const i in this.validateFormEdit.controls) {
      this.validateFormEdit.controls[i].markAsDirty();
      this.validateFormEdit.controls[i].updateValueAndValidity();
    }
    if (this.validateFormEdit.valid){
   
      let formSubmitE = new Employee();
      //formSubmitE.employeeId=this.idEmployee;
      formSubmitE.fullName= this.validateFormEdit.controls.fullName.value;
      formSubmitE.email=this.validateFormEdit.controls.email.value;
      formSubmitE.dateOfBirth=this.validateFormEdit.controls.dateOfBirth.value;
      formSubmitE.gender=this.validateFormEdit.controls.gender.value;
      formSubmitE.phoneNumber=this.validateFormEdit.controls.phoneNumber.value;
      formSubmitE.startDate=this.validateFormEdit.controls.startDate.value;
      formSubmitE.departmentId=this.validateFormEdit.controls.department.value;
      formSubmitE.roleId=this.validateFormEdit.controls.role.value;
      formSubmitE.status=true;
      console.warn("formEdit",formSubmitE);
      this.eservice.editEmployee(this.idEmployee,formSubmitE).subscribe(res=>{
        this.notification.create('success', 'Success', 'Edit Employee successfully');
        
      //  this.validateForm.reset();
        this.getAllEmployee();
      } ,(error:any)=>{
        this.notification.create('error', 'failed', 'Edit Employee failed');
      });    
      this.isShowEdit = false;
    }
  }
  

  

  //Button reset password
  resetPassword(id:number){
    console.warn("id em",id);
    this.authService.ResetPassword(id).subscribe((data:any)=>{
      this.notification.create('success','success', 'Password changed successfully')
    },(error:any)=>{
      this.notification.create('error','failed','Password changed Unsuccessfully')
    }
    );
  }

  reLoad(){
    window.location.reload();
  }
 

}
