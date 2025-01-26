//
//  SwipActionIndicatorView.swift
//  TinderTutorial
//
//  Created by Shimin Cheng on 2025-01-16.
//

import SwiftUI

struct SwipActionIndicatorView: View {
    // 动态显示两个标，越往左滑like标越明显，越往右滑nope越明显
    @Binding var xOffset: CGFloat
    
    var body: some View {
        HStack{
            Text("LIKE")
                .font(.title)
                .fontWeight(.heavy)
                .foregroundStyle(.green)
                .overlay{
                    RoundedRectangle(cornerRadius: 4)
                        .stroke(.green, lineWidth: 2)
                        .frame(width: 100, height: 48)
                }
                .rotationEffect(.degrees(-45))
                .opacity(Double(xOffset / SizeConstants.screenCutoff))
            
            Spacer()
            
            Text("NOPE")
                .font(.title)
                .fontWeight(.heavy)
                .foregroundStyle(.red)
                .overlay{ //绿色边框叠加在like上
                    RoundedRectangle(cornerRadius: 4)
                        .stroke(.red, lineWidth: 2)
                        .frame(width: 100, height: 48)
                }
                .rotationEffect(.degrees(45))
                .opacity(Double(xOffset / SizeConstants.screenCutoff) * -1)
        }
        .padding(40)
    }
}

#Preview {
    SwipActionIndicatorView(xOffset: .constant(20))
}
