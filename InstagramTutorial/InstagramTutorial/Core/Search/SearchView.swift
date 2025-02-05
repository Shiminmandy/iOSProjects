//
//  SearchView.swift
//  InstagramTutorial
//
//  Created by Shimin Cheng on 2025-02-01.
//

import SwiftUI

// a scrollable search list result
struct SearchView: View {
    
    @State private var searchText = ""
    
    var body: some View {
        NavigationStack {
            ScrollView{
                LazyVStack(spacing:12){
                    // 在循环中为每一个用户提供一个点击域导向其他页面
                    ForEach(User.MOCK_USERS){ user in
                        NavigationLink(value:user){
                            HStack {
                                Image(user.profileImageUrl ?? "")
                                    .resizable()
                                    .scaledToFill()
                                    .frame(width: 40,height: 40)
                                    .clipShape(Circle())
                                
                                VStack(alignment:.leading){
                                    Text(user.username)
                                        .fontWeight(.semibold)
                                    
                                    if let fullname = user.fullname {
                                        Text(fullname)
                                    }
                                    
                                }
                                .font(.footnote)
                                
                                Spacer()
                            }.foregroundStyle(.black)
                            .padding(.horizontal)
                            
                        }
                    }
                }
                .navigationDestination(for: User.self, destination: {user in
                    ProfileView(user: user)
                })
                .padding(.top,8)
                .searchable(text: $searchText,prompt:"Search...")
            }
            .navigationTitle("Explore")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

#Preview {
    SearchView()
}
