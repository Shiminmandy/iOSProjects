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
            }else{
                MainTabView()
            }
        }
    }
}

#Preview {
    ContentView()
}
