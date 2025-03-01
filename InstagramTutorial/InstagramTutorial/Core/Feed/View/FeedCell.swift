//
//  FeedCell.swift
//  InstagramTutorial
//
//  Created by Shimin Cheng on 2025-02-01.
//

import SwiftUI
import Kingfisher
struct FeedCell: View {
    
    let post: Post
    
    var body: some View {
        VStack{
            // image +  username
            HStack{
                if let user = post.user{
                    CircularProfileImageVIew(user: user, size: .xSmall)
                    
                    Text(user.username)
                        .font(.footnote)
                        .fontWeight(.semibold)
                }
                    Spacer()
                }
            .padding(.leading,8)
            
            // post image
            //Image(post.imageUrl)
            KFImage(URL(string: post.imageUrl))
                .resizable()
                .scaledToFill()
                .frame(height: 400)
                .clipShape(Rectangle())
            // action button
            HStack(spacing:16){
                Button{
                    print("like post")
                }label: {
                    Image(systemName: "heart")
                }
                
                Button{
                    print("Comment on post")
                }label: {
                    Image(systemName: "bubble.right")
                }
                
                Button{
                    print("Share post")
                }label: {
                    Image(systemName: "paperplane")
                }
                
                Spacer()
            }
            .padding(.leading,8)
            .padding(.top,4)
            .foregroundStyle(.black)
            
            // likes button
            
            Text("\(post.likes)")
                .font(.footnote)
                .fontWeight(.semibold)
                .frame(maxWidth: .infinity, alignment: .bottomLeading)
                .padding(.leading,10)
                .padding(.top,1)
            
            // caption label
            
            HStack {
                if let user = post.user{
                    Text(user.username).fontWeight(.semibold)
                }
                Text(post.caption)
            }
            .frame(maxWidth: .infinity,alignment: .leading)
            .font(.footnote)
            .padding(.leading,10)
         
            Text("6h ago")
                .font(.footnote)
                .frame(maxWidth: .infinity,alignment: .leading)
                .padding(.leading,10)
                .foregroundStyle(.gray)
        }
    }
}

#Preview {
    FeedCell(post: Post.MOCK_POSTS[4])
}
