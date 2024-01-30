import { AfterViewInit, Component, EventEmitter, Inject, ViewChild } from '@angular/core';
import { RestApiService } from '../service/rest-api.service';
import { Router } from '@angular/router';
import { Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from '../register/register.component';
import { Register } from '../shared/register';
import { HomeComponent } from '../home/home.component';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements AfterViewInit {
  @ViewChild("Register") addView: HomeComponent;
  @ViewChild("Registerforms") Forms: RegisterComponent;
  EditDatas:any;
  LastProfile:any;
  profilePic:any;
  profileData:any;
  Imageurl:any='';
  name: string;
  lname: string;
  email: string;
  phone:number;
  state:string;
  tag:string;
  age:number;
  fileInput: any;
  id:number;
  register: Register;
  editData:any
  editPhoto:any

  
  constructor(private service:RestApiService, private dialog: MatDialog, private router: Router){}
  ngAfterViewInit(): void {
    // this.onEditProfile()
    this.onEditPhoto(this.editPhoto)
    // const data = this.addView.EditProfile()
    // console.log(data)
    
  }
  
  ngOnInit():void{
    // this.loadProfile();
    // const myData=this.data
    // console.log(myData)
  //   if(this.data.id!='' && this.data.id != null)
  //   this.service.EditProfile(this.data.id).subscribe(res=>{
  //   this.editData=res;
  //   this.ProfileForm.setValue({id:this.editData,profileImg:this.editData,firstname:this.editData,lastname:this.editData,email:this.editData,})
  // });
    this.GetAllProfile();
    this.getProfile();
  }
  
  GetAllProfile(){
    this.service.GetAllProfile().subscribe(response=>{
      this.profileData = response;
      console.log(this.profileData)
    });
  }

  getProfile(){
    this.service.getProfile().subscribe(response =>{
      const data = this.LastProfile = response;
      console.log('Last Profile:',data);
      let dataImg = data.lastProfile.profileImg;
      this.name = data.lastProfile.firstname;
      this.lname = data.lastProfile.lastname;
      this.age = data.lastProfile.age;
      this.email = data.lastProfile.email;
      this.state = data.lastProfile.state;
      this.tag = data.lastProfile.tag;
      this.phone = data.lastProfile.contact;
      let Id = data.lastProfile.id;
      console.log(Id)
      // console.log(dataImg)
      this.Imageurl=dataImg;
      
    })
  }
  // getProfileById(){
  //   this.service.getProfileById().subscribe(response=>{
  //      const data = this.profileData = response ;
  //      console.warn("Id",data)

  //   })
  // }
  // data:any;
  // Edit(e:any){
  //   this.service.EditProfile(e).subscribe(response=>{
  //     const Data = this.data = response
  //     console.log(Data)

  //   })
  // }
  profileForm:Register
  // uploadFile(event: any) {
  //   let reader = new FileReader();
  //   let file = event.target.files[0];
  //   if (event.target.files && event.target.files[0]) {
  //     reader.readAsDataURL(file);

  //     reader.onload = (e:any) => {
  //       this.imageUrl = reader.result;

  //       this.RegisterForm.patchValue({
  //         profileImg: this.imageUrl,
  //       });
  //       this.editFile = false;
  //       this.removeUpload = true;
  //     };
  //     this.cd.markForCheck();
  //   }
  // }

  onEditPhoto(event:any){
    let reader = new FileReader();
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
          reader.readAsDataURL(file);
          reader.onload = (e:any) => {
                  this.Imageurl = reader.result; 
                  this.editPhoto=this.Forms.uploadFile(e)
                  
                  // this.service.RemoveProfile(e)     
          }
        }
       }

  // onEditPhoto(event:any){
  //   let reader = new FileReader();
  //   let file = event.target.files[0];
  //   if (file) {
  //         reader.readAsDataURL(file);
  //         reader.onload = (e:any) => {
  //                 this.Imageurl = reader.result;
  //                 const updateProfile:Register ={
  //                   ...this.register
  //                   image =
  //                 }
                   
  //         }
  //       }
  //      }

  // openDialog(id:any){
  //   const dialogRef = this.dialog.open(RegisterComponent, {
  //     width: '50%',
  //     enterAnimationDuration: '1000ms',
  //     exitAnimationDuration: '1000ms',
      
  //   })
  //   this.service.getProfile().subscribe(res=>{
  //     const data = res;
  //     console.log(data)
      
  //   })
  // }
  

  onEditProfile(id:any){
    this.addView.openDialog()
  

  }
  // loadProfile(){
  //   this.service.GetAllProfile().subscribe(response=>{
  //     this.profileData=response;

  //   })
  // }


}