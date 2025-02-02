//
//  FeedCell.swift
//  InstagramTutorial
//
//  Created by Shimin Cheng on 2025-02-01.
//

import SwiftUI

struct FeedCell: View {
    var body: some View {
        VStack{
            // image +  username
            HStack{
                Image("lusi2")
                    .resizable()
                    .scaledToFill()
                    .frame(width: 40, height: 40)
                    .clipShape(Circle())
                
                Text("zhaolusi")
                    .font(.footnote)
                    .fontWeight(.semibold)
                Spacer()
            }
            .padding(.leading,8)
            
            // post image
            Image("lusi1")
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
            
            Text("23 likes")
                .font(.footnote)
                .fontWeight(.semibold)
                .frame(maxWidth: .infinity, alignment: .bottomLeading)
                .padding(.leading,10)
                .padding(.top,1)
            
            // caption label
            
            HStack {
                Text("zhaolusi").fontWeight(.semibold)
                Text("This is some test caption for now")
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
    FeedCell()
}
