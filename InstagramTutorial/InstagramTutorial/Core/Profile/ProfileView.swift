//
//  ProfileView.swift
//  InstagramTutorial
//
//  Created by Shimin Cheng on 2025-01-26.
//

import SwiftUI

struct ProfileView: View {
    
    var body: some View {
        VStack{
            // header
            VStack(spacing: 10){
                HStack{
                    // pic and stats
                    Image("lusi5")
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
                    Text("Chaswick Bozeman")
                        .font(.footnote)
                        .fontWeight(.semibold)
                    
                    Text("Wakanda Forever")
                        .font(.footnote)
                        
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
            
            // post grid view
            
            
        }
    }
}

#Preview {
    ProfileView()
}
