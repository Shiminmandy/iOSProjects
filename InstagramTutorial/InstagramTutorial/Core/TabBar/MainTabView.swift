//
//  MainTabView.swift
//  InstagramTutorial
//
//  Created by Shimin Cheng on 2025-01-26.
//

import SwiftUI

struct MainTabView: View {
    
    var body: some View {
        TabView{
            Text("Feed")
                .tabItem{
                    Image(systemName: "house")
                }
            
            Text("Search")
                .tabItem{
                    Image(systemName: "magnifyingglass")
                }
            
            Text("Upload Post")
                .tabItem{
                    Image(systemName: "plus.square")
                }
            
            Text("Notification")
                .tabItem{
                    Image(systemName: "heart")
                }
            
            Text("Profile")
                .tabItem{
                    Image(systemName: "person")
                }
        }
        .accentColor(.black)
    }
}

#Preview {
    MainTabView()
}
