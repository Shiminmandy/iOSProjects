//
//  ViewControllerWrapper.swift
//  ChatVideo
//
//  Created by Shimin Cheng on 2025-03-10.
//

import Foundation

import SwiftUI
import UIKit

struct ViewControllerWrapper: UIViewControllerRepresentable {
    func makeUIViewController(context: Context) -> UIViewController {
        return ViewController() // 使用你的 ViewController
    }

    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {
        // 如果需要动态更新，可以在这里处理
    }
}
