//
//  CustomOperators.swift
//  RemindersApp
//
//  Created by Shimin Cheng on 2025-03-07.
//

import Foundation

import SwiftUI

public func ??<T>(lhs: Binding<Optional<T>>, rhs: T) -> Binding<T> {
    
    Binding(get: {lhs.wrappedValue ?? rhs},
            set: {lhs.wrappedValue = $0}
    )
}
