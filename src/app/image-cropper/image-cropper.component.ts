import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import Cropper from "cropperjs";
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'image-cropper',
    templateUrl: './image-cropper.component.html',
    styleUrls: ['./image-cropper.component.css']
})
export class ImageCropperComponent implements OnInit {

    @ViewChild("image", { static: false })
    public imageElement: ElementRef;
    public croppedImageName:string="hi";
    public imageSource: string;

    public imgWidth: number;
    public imgHeight: number;

    public imageDestination: string;
    public base64: string;
    private cropper: Cropper;

    imageList: any[];
    pdfImagesUrl: any[];
    formData = new FormData();

    public constructor(
              private http : HttpClient
    ) {
        this.imageDestination = "";
        this.imageSource = "assets/angular.png";
        //this.pdfImagesUrl = ["assets/angular.png","C:/Images/AmeriHome 1/AmeriHome 11"];
        //this.imageSource = "C:/Images";
    }

    public ngAfterViewInit() {
        this.cropper = new Cropper(this.imageElement.nativeElement, {
            zoomable: false,
            scalable: false,
            aspectRatio: 0,
            crop: () => {
                const canvas = this.cropper.getCroppedCanvas();
                this.imgWidth = canvas.width;
                this.imgHeight = canvas.height;
                this.imageDestination = canvas.toDataURL("image/png");
                console.log(this.imageDestination);
            }
        });
    }

    public imageSelected()
    {
      // Naming the image
      // const date = new Date().valueOf();
      // let text = '';
      // const possibleText = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      // for (let i = 0; i < 5; i++) 
      // {
      //   text += possibleText.charAt(Math.floor(Math.random() *    possibleText.length));
      // }
      // Replace extension according to your media type
      // const imageName = date + '.' + text + '.jpeg';
      const imageName = this.croppedImageName+'.jpeg';
      console.log(imageName);
      // call method that creates a blob from dataUri
      const imageBlob = this.dataURItoBlob(this.imageDestination);
      const imageFile = new File([imageBlob], imageName, { type: 'image/jpeg' });
      this.AddToImageList(imageName,imageFile);
      this.http.post<any>("http://localhost:22528/api/Upload/user/PostUserImage", this.formData).subscribe(
        (data: any) => { 
      }
    ); 
  
      
    }

    public AddToImageList(imageName:any,imageFile:any)
    {
        this.formData.append("File",imageFile);
    }

    public dataURItoBlob(dataURI) 
    {
      this.base64 = dataURI.substr(22);
      const byteString = window.atob(this.base64);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const int8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([int8Array], { type: 'image/jpeg' });    
      return blob;
   }

    public ngOnInit() { }

}

