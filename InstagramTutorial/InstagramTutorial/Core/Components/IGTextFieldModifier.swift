//
//  IGTextFieldModifier.swift
//  InstagramTutorial
//
//  Created by Shimin Cheng on 2025-02-04.
//

import Foundation
import SwiftUI

//封装视图修改器
struct IGTextFieldModifier: ViewModifier{
    
    func body(content: Content) -> some View{
        content
            .font(.subheadline)
            .padding(12)
            .background(Color(.systemGray6))
            .cornerRadius(10)
            .padding(.horizontal,24)
    }
}
