//
//  ContentView.swift
//  InstagramTutorial
//
//  Created by Shimin Cheng on 2025-01-25.
//

import SwiftUI

struct ContentView: View {
    @StateObject var viewModel = ContentViewModel()
    @StateObject var regisrationViewModel = RegisrationViewModel()
    var body: some View {
        Group{
            if viewModel.userSession == nil{
                LoginView()
                    .environmentObject(regisrationViewModel)
            }else if let currentUser = viewModel.currentUser{
                MainTabView(user: currentUser)
            }
        }
    }
}

#Preview {
    ContentView()
}
