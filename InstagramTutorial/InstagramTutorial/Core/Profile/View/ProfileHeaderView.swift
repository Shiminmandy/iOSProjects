//
//  ProfileHeaderView.swift
//  InstagramTutorial
//
//  Created by Shimin Cheng on 2025-02-05.
//

import SwiftUI

struct ProfileHeaderView: View {
    @State private var showEditProfile = false
    
    let user: User
    var body: some View {
        
        VStack{
            
            VStack(spacing: 10){
                HStack{
                    // pic and stats
                    Image(user.profileImageUrl ?? "")
                        .resizable()
                        .scaledToFill()
                        .frame(width: 80,height: 80)
                        .clipShape(Circle())
                    
                    Spacer()
                    
                    HStack(spacing:8) {
                        UserStatView(value: 93, title: "Posts")
                        UserStatView(value: 5200000, title: "Followers")
                        UserStatView(value: 12, title: "Following")
                    }
                    
                    
                }
                .padding(.horizontal)
                
                
                // name and bio
                VStack(alignment: .leading,spacing:4){
                    if let fullname = user.fullname {
                        Text(fullname)
                            .font(.footnote)
                            .fontWeight(.semibold)
                    }
                    
                    if let bio = user.bio{
                        Text(bio)
                            .font(.footnote)
                    }
                    
                    Text(user.username)
                    
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal)
                
                // action button
                Button{
                    if user.isCurrentUser {
                        showEditProfile.toggle()
                    } else{
                        print("show follow")
                    }
                }label: {
                    //Text("Edit Profile")
                    // 根据当前登录用户决定
                    Text(user.isCurrentUser ? "Edit Profile" : "Follow")
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .frame(width: 360, height: 32)
                        .background(user.isCurrentUser ? .white : Color(.systemBlue))
                        .foregroundStyle(user.isCurrentUser ? .black : .white)
                        .overlay{
                            RoundedRectangle(cornerRadius: 9)
                                .stroke(Color.gray,lineWidth: 1 )
                        }
                }
                Divider()
            }
            .fullScreenCover(isPresented: $showEditProfile, content: {
                EditProfileView(user: user)
            })
        }
    }
}

#Preview {
    ProfileHeaderView(user: User.MOCK_USERS[0])
}
