//
//  CurrentUserProfileView.swift
//  InstagramTutorial
//
//  Created by Shimin Cheng on 2025-02-04.
//

import SwiftUI

struct CurrentUserProfileView: View {
    
    let user: User

    //同一个用户的所有posts
    var posts: [Post] {
        return Post.MOCK_POSTS.filter({$0.user?.username == user.username})
    }
    
    var body: some View {
        NavigationStack {
            ScrollView {
                // header
                ProfileHeaderView(user: user)
                    
                // post grid view
                
                PostGridView(user: user)
            }
            .navigationTitle("Profile")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar{
                ToolbarItem(placement: .navigationBarTrailing){
                    Button{
                        AuthService.shared.signout()
                    }label: {
                        Image(systemName: "line.3.horizontal")
                            .foregroundColor(.black)
                    }
                }
            }
        }
        
    }
}

#Preview {
    CurrentUserProfileView(user: User.MOCK_USERS[4])
}
