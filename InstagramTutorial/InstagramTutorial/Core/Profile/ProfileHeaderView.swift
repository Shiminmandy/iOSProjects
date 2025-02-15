//
//  ProfileHeaderView.swift
//  InstagramTutorial
//
//  Created by Shimin Cheng on 2025-02-05.
//

import SwiftUI

struct ProfileHeaderView: View {
    
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
                    
                }label: {
                    Text("Edit Profile")
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .frame(width: 360, height: 32)
                        .foregroundStyle(.black)
                        .overlay{
                            RoundedRectangle(cornerRadius: 6)
                                .stroke(Color.gray,lineWidth: 1 )
                        }
                }
                Divider()
            }
        }
    }
}

#Preview {
    ProfileHeaderView(user: User.MOCK_USERS[0])
}
