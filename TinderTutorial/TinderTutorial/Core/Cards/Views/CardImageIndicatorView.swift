//
//  CardImageIndicatorView.swift
//  TinderTutorial
//
//  Created by Shimin Cheng on 2025-01-17.
//

import SwiftUI

struct CardImageIndicatorView: View {
    
    let currentImageIndex: Int
    let imageCount: Int
    
    var body: some View {
        HStack{
            ForEach(0 ..< imageCount, id: \.self) { index in
                Capsule()
                    .foregroundStyle(currentImageIndex == index ? .white : .gray)
                    .frame(width: imageIndicatorWidth,height: 4)
                    .padding(.top, 8)
            }
            
        }
    }
}

private extension CardImageIndicatorView{
    
    var imageIndicatorWidth: CGFloat{
        return SizeConstants.cardWidth / CGFloat(imageCount) - 20
    }
}

#Preview {
    CardImageIndicatorView(currentImageIndex: 1, imageCount: 4)
}
