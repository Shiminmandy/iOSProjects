//
//  SwipeActionButtonView.swift
//  TinderTutorial
//
//  Created by Shimin Cheng on 2025-01-19.
//

import SwiftUI

struct SwipeActionButtonView: View {
    
    @ObservedObject var viewModel: CardsViewModel
    
    var body: some View {
        HStack(spacing: 32){
            Button{
                viewModel.buttonSwipeAction = .reject
            }label: {
                Image(systemName: "xmark")
                    .fontWeight(.heavy)
                    .foregroundStyle(.red)
                    .background{
                        Circle()
                            .fill(.white)
                            .frame(width: 48, height: 48)
                            .shadow(radius: 6)
                    }
            }
            .padding()
            
            
            Button{
                viewModel.buttonSwipeAction = .like
            }label: {
                Image(systemName: "heart.fill")
                    .fontWeight(.heavy)
                    .foregroundStyle(.green)
                    .background{
                        Circle()
                            .fill(.white)
                            .frame(width: 48, height: 48)
                            .shadow(radius: 6)
                    }
            }
            .padding()
        }
    }
}

#Preview {
    SwipeActionButtonView(viewModel: CardsViewModel(service: CardService()))
}
