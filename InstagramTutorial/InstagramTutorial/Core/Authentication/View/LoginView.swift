//
//  LoginView.swift
//  InstagramTutorial
//
//  Created by Shimin Cheng on 2025-02-01.
//

import SwiftUI

struct LoginView: View {
//    @State private var email = ""
//    @State private var password = ""
    @StateObject var viewModel = LoginViewmodel()
    
    var body: some View {
        
        NavigationStack{
            VStack{
                
                // logo image
                Image("instagram")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 220,height: 100)
                
                // text field
                VStack{
                    TextField("Entre your email",text: $viewModel.email)
                        .autocapitalization(.none)
                        .modifier(IGTextFieldModifier())
                    
                    TextField("Entre your password",text: $viewModel.password)
                        .autocapitalization(.none)
                        .font(.subheadline)
                        .padding(12)
                        .background(Color(.systemGray6))
                        .cornerRadius(10)
                        .padding(.horizontal,24)
                }
                
                Button{
                    print("Show forgot password")
                }label: {
                    Text("Forgot Password?")
                        .font(.footnote)
                        .fontWeight(.semibold)
                        .padding(.top)
                        .padding(.trailing,28)
                }
                .frame(maxWidth: .infinity,alignment: .trailing)
                
                Button{
                    Task{
                        try await viewModel.signIn()
                    }
                }label: {
                    Text("Login")
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .foregroundStyle(.white)
                        .frame(width: 360,height: 44)
                        .background(Color(.systemBlue))
                        .cornerRadius(8)
                }
                .padding(.vertical)
                
                HStack{
                    // 拼接
                    Rectangle()
                        .frame(width: (UIScreen.main.bounds.width / 2) - 40, height: 0.5)
                        
                    
                    Text("OR")
                        .font(.footnote)
                        .fontWeight(.semibold)
                        
                    
                    Rectangle()
                        .frame(width: (UIScreen.main.bounds.width / 2) - 40, height: 0.5)
                       
                }.foregroundStyle(.gray)
                
                HStack{
                    Image("metalogo")
                        .resizable()
                        .frame(width: 32,height: 15)
                    
                    Text("Continue with meta")
                        .font(.footnote)
                        .fontWeight(.semibold)
                        .foregroundStyle(Color(.systemBlue))
                }
                .padding(.top,8)
                
                Spacer()
                
                Divider()
                
                NavigationLink {
                    AddEmailView()
                        .navigationBarBackButtonHidden(true)
                } label: {
                    HStack{
                        Text("Dont have an account?")
                        
                        Text("Sign up")
                            .fontWeight(.semibold)
                    }
                    .font(.footnote)
                }
                .padding(.vertical,16)
            }
        }
    }
}

#Preview {
    LoginView()
}
