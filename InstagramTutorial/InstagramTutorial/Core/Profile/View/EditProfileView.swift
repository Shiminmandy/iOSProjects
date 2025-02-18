//
//  EditProfileView.swift
//  InstagramTutorial
//
//  Created by Shimin Cheng on 2025-02-17.
//

import SwiftUI
import PhotosUI

struct EditProfileView: View {
    
    @Environment(\.dismiss) var dismiss
//    @State private var selectedImage: PhotosPickerItem?
//    @State private var fullname = ""
//    @State private var bio = ""
    @StateObject var viewModel: EditProfileViewModel
    
    init(user: User){
        self._viewModel = StateObject(wrappedValue: EditProfileViewModel(user: user))
    }

    
    var body: some View {
        VStack{
            // tool bar
            
            VStack{
                HStack{
                    Button("Cancle"){
                        dismiss()
                    }
                    Spacer()
                    
                    Text("Edit Profile")
                        .font(.subheadline)
                        .fontWeight(.semibold)
                    
                    Spacer()
                    
                    Button{
                        Task{
                            try await viewModel.uploadUserData()
                        }
                    }label: {
                        Text("Done")
                            .font(.subheadline)
                            .fontWeight(.bold)
                    }
                }
                .padding()
                
                Divider()
                
            }
            // edit profile pic
            PhotosPicker(selection:$viewModel.selectedImage){
                VStack{
                    if let image = viewModel.profileImage{
                        image
                            .resizable()
                            .background(.gray)
                            .foregroundStyle(.white)
                            .clipShape(Circle())
                            .frame(width: 80,height: 80)
                    }else {
                        Image(systemName: "person")
                            .resizable()
                            .background(.gray)
                            .foregroundStyle(.white)
                            .clipShape(Circle())
                            .frame(width: 80,height: 80)
                        
                    }
                        Text("Edit profile picture")
                            .font(.footnote)
                            .fontWeight(.semibold)
                        
                        Divider()
                }
            }
            .padding(.vertical,8)
            // edit profile info
            
            VStack{
                EditProfileRowView(title: "Name", placeholder: "Enter your name..", text: $viewModel.fullname)
                EditProfileRowView(title: "Name", placeholder: "Enter your name..", text: $viewModel.bio)
            }
        }
        Spacer()
    }
}

struct EditProfileRowView: View{
    
    let title: String
    let placeholder: String
    @Binding var text: String
    
    var body: some View{
        
        HStack{
            Text("title")
                .padding(.leading,8)
                .frame(width: 100, alignment: .leading)
            
            VStack{
                TextField(placeholder, text: $text)
                
                Divider()
            }
        }
        .font(.subheadline)
        .frame(height: 36)
    }
}
#Preview {
    EditProfileView(user: User.MOCK_USERS[0])
}
