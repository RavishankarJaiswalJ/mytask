import { Component } from '@angular/core';
import { RestApiService } from '../service/rest-api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
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
  
  constructor(private service:RestApiService){}

  ngOnInit():void{
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
      console.log(name)
      console.log(dataImg)
      this.Imageurl=dataImg;
      
    })
  }
  
  // uploadFile(event: any) {
  //   let reader = new FileReader();
  //   let file = event.target.files[0];
  //   if (event.target.files && event.target.files[0]) {
  //     reader.readAsDataURL(file);

  //     reader.onload = (e:any) => {
  //       this.Imageurl = reader.result;

  //       this.RegisterForm.patchValue({
  //         profileImg: this.imageUrl,
  //       });
  //       this.editFile = false;
  //       this.removeUpload = true;
  //     };
  //     this.cd.markForCheck();
  //   }
  // }
 
}
