//
//  CompleteSignUpView.swift
//  InstagramTutorial
//
//  Created by Shimin Cheng on 2025-02-04.
//

import SwiftUI

struct CompleteSignUpView: View {

    @EnvironmentObject var viewModel: RegisrationViewModel
    @Environment(\.dismiss) var dismiss
    var body: some View {
        VStack(spacing:12){
            Spacer()
            Text("Welcome to Instagram, stephan.downless")
                .font(.title)
                .fontWeight(.bold)
                .padding(.top)
                .multilineTextAlignment(.center)
            
            Text("Click below to complete regisration and start using Instagram")
                .font(.footnote)
                .foregroundStyle(.gray)
                .multilineTextAlignment(.center)
                .padding(.horizontal,24)
            
            
            Button{
                Task{
                    try await viewModel.createUser()
                }
            }label: {
                Text("Complete Sign Up")
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
    CompleteSignUpView()
        .environmentObject(RegisrationViewModel())
}
