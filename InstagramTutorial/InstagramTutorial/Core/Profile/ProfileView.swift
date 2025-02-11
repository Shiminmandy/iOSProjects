//
//  ProfileView.swift
//  InstagramTutorial
//
//  Created by Shimin Cheng on 2025-01-26.
//

import SwiftUI

struct ProfileView: View {
    // initiallized with user
    let user: User
    
    
    //同一个用户的所有posts
    var posts: [Post] {
        return Post.MOCK_POSTS.filter({$0.user?.username == user.username})
    }
    
    
    var body: some View {
        //NavigationStack {
        ScrollView {
            // header
            ProfileHeaderView(user: user)
            
            // post grid view
            
            PostGridView(posts: posts)
            }
            .navigationTitle("Profile")
            .navigationBarTitleDisplayMode(.inline)
            
        }
    //}
}

#Preview {
    ProfileView(user: User.MOCK_USERS[0])
}
