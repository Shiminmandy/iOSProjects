//
//  ContentView.swift
//  ChatVideo
//
//  Created by Shimin Cheng on 2025-03-10.
//

import SwiftUI

struct ContentView: View {
    @StateObject private var viewModel = TUICallKitService()
        
        var body: some View {
            VStack(spacing: 20) {
                Button(action: {
                    viewModel.login()
                }) {
                    Text("Login")
                        .frame(width: 100, height: 40)
                        .background(Color.gray)
                        .foregroundColor(.white)
                        .cornerRadius(8)
                }
                
                Button(action: {
                    viewModel.call()
                }) {
                    Text("Call")
                        .frame(width: 100, height: 40)
                        .background(Color.gray)
                        .foregroundColor(.white)
                        .cornerRadius(8)
                }
                .disabled(!viewModel.isLoggedIn) // 禁用按钮，直到登录成功
            }
        }
}

#Preview {
    ContentView()
}
