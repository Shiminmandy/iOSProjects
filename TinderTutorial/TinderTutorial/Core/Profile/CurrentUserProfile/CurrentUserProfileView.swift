//
//  CurrentUserProfileView.swift
//  TinderTutorial
//
//  Created by Shimin Cheng on 2025-01-23.
//

import SwiftUI

struct CurrentUserProfileView: View {
    
    let user: User
    @State private var showEditProfile: Bool = false
    
    var body: some View {
        NavigationStack{
            List{
                // header view
                CurrentUserProfileHeaderView(user: user)
                    .onTapGesture {
                        showEditProfile.toggle()
                    }
                
                // account info
                Section("Account Infomation"){
                    HStack{
                        Text("Name")
                        
                        Spacer()
                        
                        Text(user.fullname)
                    }
                    HStack{
                        Text("Email")
                        
                        Spacer()
                        
                        Text("test@gmail.com")
                    }
                }
                
                // legal
                Section("Legal"){
                    Text("Terms of Services")
                }
                
                // logout/delete
                
                Section {
                    Button{
                        print("DEBUG: Logout here...")
                    } label: {
                        Text("Logout")
                    }.foregroundStyle(.red)
                    
                    Button{
                        print("DEBUG: Delete Account here...")
                    } label: {
                        Text("Delete Account")
                    }.foregroundStyle(.red)
                }
            }
            .navigationTitle("Profile")
            .navigationBarTitleDisplayMode(.inline)
            .fullScreenCover(isPresented: $showEditProfile){
                EditProfileView(user: user)
            }
            .tint(.primary)
            
        }
    }
}

#Preview {
    CurrentUserProfileView(user: MockData.users[0])
}
