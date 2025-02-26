//
//  UploadPostView.swift
//  InstagramTutorial
//
//  Created by Shimin Cheng on 2025-02-05.
//

import SwiftUI
import PhotosUI

struct UploadPostView: View {
    
    @State private var caption = ""
    @State private var imagePickerPresented = false //用于显示上传照片的界面
    @StateObject var viewModel = UploadViewModel()
    @Binding var tabIndex: Int
    
    var body: some View {
        VStack{
            // action bar
            HStack{
                
                Button{
                    clearPostDataAndReturnToFeed()
                }label: {
                    Text("Cancel")
                }
                
                Spacer()
                
                Text("New Post")
                    .fontWeight(.semibold)
                
                Spacer()
                
                Button{
                    Task{
                        try await viewModel.uploadPost(caption: caption)
                        clearPostDataAndReturnToFeed()
                    }
                }label: {
                    Text("Upload")
                        .fontWeight(.semibold)
                }
            }
            .padding(.horizontal)
            
            // Post image and caption
            HStack(spacing:8){
                if let image = viewModel.postImage{
                    image
                        .resizable()
                        .scaledToFill()
                        .frame(width: 100,height: 100)
                        .clipped()
                }
                TextField("Enter your caption ...", text: $caption,axis: .vertical)
            }
            
            Spacer()
            
        }
        
        .onAppear{
            imagePickerPresented.toggle()
        }
        .photosPicker(isPresented: $imagePickerPresented, selection: $viewModel.selectedImage)
    }
    
    func clearPostDataAndReturnToFeed(){
        caption = ""
        viewModel.selectedImage = nil
        viewModel.postImage = nil
        tabIndex = 0
    }

}

#Preview {
    UploadPostView(tabIndex: .constant(0))
}
