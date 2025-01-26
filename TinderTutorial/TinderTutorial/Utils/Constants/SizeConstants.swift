//
//  SizeConstants.swift
//  TinderTutorial
//
//  Created by Shimin Cheng on 2025-01-16.
//

import Foundation
import SwiftUI

struct SizeConstants{
    
    // extension of size and movement

    static var screenCutoff: CGFloat{
        (UIScreen.main.bounds.width / 2) * 0.8
    }
    static var cardWidth: CGFloat{
        UIScreen.main.bounds.width - 20
    }
    
    static var cardHeight: CGFloat{
        UIScreen.main.bounds.height / 1.45
    }
    
}
