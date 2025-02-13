//
//  AddEmailView.swift
//  InstagramTutorial
//
//  Created by Shimin Cheng on 2025-02-04.
//

import SwiftUI

struct AddEmailView: View {
    //@State private var email = ""
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var viewModel: RegisrationViewModel
    
    var body: some View {
        VStack(spacing:12){
            Text("Add your email")
                .font(.title)
                .fontWeight(.bold)
                .padding(.top)
            
            Text("You'll use this email to sign in to your account")
                .font(.footnote)
                .foregroundStyle(.gray)
                .multilineTextAlignment(.center)
                .padding(.horizontal,24)
            
            TextField("Email", text: $viewModel.email)
                .autocapitalization(.none)
                .modifier(IGTextFieldModifier())
            
            NavigationLink{
                CreateUsernameView()
                    .navigationBarBackButtonHidden(true)
            }label: {
                Text("Next")
                    .font(.subheadline)
                    .fontWeight(.semibold)
                    .frame(width: 360,height: 44)
                    .foregroundStyle(.white)
                    .background(Color(.systemBlue))
                    .cornerRadius(8)
            }
            .padding(.vertical)
            
            Spacer()
        }
        .toolbar{
            ToolbarItem(placement:.navigationBarLeading){
                Image(systemName: "chevron.left")
                    .imageScale(.large)
                    .onTapGesture {
                        dismiss()
                    }
            }
        }
    }
}

#Preview {
    AddEmailView().environmentObject(RegisrationViewModel())
}
