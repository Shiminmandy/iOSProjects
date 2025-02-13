//
//  ContentView.swift
//  InstagramTutorial
//
//  Created by Shimin Cheng on 2025-01-25.
//

import SwiftUI

struct ContentView: View {
    @StateObject var viewModel = ContentViewModel()
    
    var body: some View {
        Group{
            if viewModel.userSession == nil{
                LoginView()
            }else{
                MainTabView()
            }
        }
    }
}

#Preview {
    ContentView()
}
